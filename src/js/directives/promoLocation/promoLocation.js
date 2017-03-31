// Purpose is to build promotion code spec.
app.directive(
    'promoLocation', [
        '$filter',
        'locationDataService',
        'skuTestRecord',
        'DataFactory',
        function ($filter, locationDataService, skuTestRecord,
            DataFactory) {
            return {
                restrict: 'E',
                templateUrl: 'promoLocation.html',
                scope: {
                    data: '=',
                    promoform: '=',
                    preview: '='
                },
                controller: function () {



                },
                link: function (scope) {
                    var storeData = {};
                    var existingID = '';
                    scope.searchResults = [];
                    scope.validStoreInfo = [];
                    scope.inValidStoreInfo = false;
                    scope.showInvalidError = false;
                    scope.addStoretest = addStore;

                    /* Adding stores data to the table */
                    function addStore(item) {
                        if (!scope.data) {
                            scope.data = [];
                        }
                        if (scope.data.indexOf(item.storeNumber) === -1) {
                            scope.validStoreInfo.push(item);
                            setData();
                        } else {
                            existingID += item.storeNumber + ', ';
                            DataFactory.messageModal.message = 'Following stores are already added: ' +
                                existingID
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                        }

                    }

                    function setData() {

                        var templocation = scope.data.locations;
 
                        scope.data = scope.validStoreInfo.reduce(function (data, item) {
                            return data.concat(item.storeNumber);
                        }, []);

                        scope.data.locations = templocation;
                    }

                    function setStoreData(data, clicked) {
                        existingID = '';

                        if (!scope.validStoreInfo.length && scope.data && !scope.itemSearch) {
                            $.extend(true,
                                scope.validStoreInfo,
                                data.validStoreInfo);
                        }
                        if (data.validStoreInfo &&
                            scope.itemSearch) {
                            for (var i = 0; i < data.validStoreInfo.length; i++) {
                                addStore(data.validStoreInfo[i]);
                            }
                        }

                        /* if invalid Data set to item search */
                        scope.itemSearch = (data.inValidStoreInfo) ? [data.inValidStoreInfo
                            .toString().replace(/,/g, ' ')
                        ] : [];
                        scope.inValidStoreInfo = (scope.itemSearch.length > 0);
                        var invalidIds = data.inValidStoreInfo;
                        if (clicked && invalidIds &&
                            invalidIds.length > 0) {
                            DataFactory.messageModal.message = 'Following store numbers are invalid: ' +
                                invalidIds;
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                        }
                    }
                    /* Data Service Call for Edit to display the selected store data */
                    function getStoresByIdEdit(data,clicked) {
                        var tempData = {};
                        tempData.locationNumbers = locationDataService
                            .getStoreIds(data.locationNumbers)

                        var locationPromise = locationDataService
                            .getStoreIdCodes(tempData);

                        locationPromise
                            .then(
                                function (data) {

                                    setStoreData(data,
                                        clicked);
                                },
                                function (error) {
                                    DataFactory.messageModal.message = error;
                                    DataFactory.messageModal.title = 'Error';
                                    $('#messageModal')
                                        .popup();
                                });
                    }
                    /* Data Service Call for Store & Market Search  */
                    function getStoresByID(data, location, clicked) {

            
                        var tempData = {};
                        var locationPromise = {};

                        tempData.locationNumbers = locationDataService
                            .getStoreIds(data.locationNumbers)

                        if(location == 'stores' ) { 
                            locationPromise = locationDataService
                            .getStoreIdCodes(tempData);

                            locationPromise
                            .then(
                                function (data) {

                                    setStoreData(data,
                                        clicked);
                                },
                                function (error) {
                                    DataFactory.messageModal.message = error;
                                    DataFactory.messageModal.title = 'Error';
                                    $('#messageModal')
                                        .popup();
                                });


                        }
                        else
                        {
                                                 
                            locationPromise = locationDataService
                            .getStoresFromMarkets(tempData);

                            locationPromise
                            .then(
                                function (data) {

                                    setStoreData(data,
                                        clicked);
                                },
                                function (error) {
                                    DataFactory.messageModal.message = error;
                                    DataFactory.messageModal.title = 'Error';
                                    $('#messageModal')
                                        .popup();
                                });    


                        }
                
                        
                    }

                    function validateStoreData(data) {
                        if (data.length == 0) {
                            scope.showInvalidError = true;
                            return;
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (/\s/g.test(data[i]) ||
                                /[a-z]/i.test(data[i])) {
                                scope.showInvalidError = true;
                                return;
                            }

                            scope.showInvalidError = false;
                        }
                    }

                    if (scope.data && scope.data.length) {
                        storeData.locationNumbers = scope.data;        
                        getStoresByIdEdit(storeData, true)
                    }

                    scope.searchResults = [];

                    scope.removePromoCode = function (index) {
                        scope.validStoreInfo.splice(index, 1);
                        setData();
                    }

                    scope.search = function (data,location) {

                        if(location =='stores' ) {
        
                            if (!data || data == null || data == '') {
                                DataFactory.messageModal.message = 'Please enter a valid Store Number';
                                DataFactory.messageModal.title = 'Warning';
                                $('#messageModal').popup();
                            } else {
                                data = data.replace(/\s\s+/g, ' ')
                            .split(/[',',' ',', ']+/);

                                filterStoreData(data);
                                validateStoreData(data);
                                storeData.locationNumbers = data;

                                if (!scope.showInvalidError) {
                                    getStoresByID(storeData, location, true);
                                }
                            }

                        }
           
                        else {
                            if (!data || data == null || data == '') {
                                DataFactory.messageModal.message = 'Please enter a valid Market Number';
                                DataFactory.messageModal.title = 'Warning';
                                $('#messageModal').popup();
                            } 
                            else {
                                data = data.replace(/\s\s+/g, ' ')
                                .split(/[',',' ',', ']+/);

                                filterStoreData(data);
                                validateStoreData(data);
                                storeData.locationNumbers = data;
                                if (!scope.showInvalidError) {   
                                    getStoresByID(storeData, location, true);
                                }
                            }
                        }              
                    }

                

                    /* method added to ignore store values > 5 */
                    function filterStoreData(data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].length > 18) {
                                data.splice(i, 1);
                            }
                        }
                    }

                    scope.removeAll = function () {
                        scope.validStoreInfo = [];
                        setData();
                    }
                    scope.clear = function () {
                        scope.inValidStoreInfo = false;
                    }
                }
            };
        }
    ]);
