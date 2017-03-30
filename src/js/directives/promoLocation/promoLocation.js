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
                    //scope.data.locations = 'stores';
             
                    scope.addStoretest = addStore;

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
                        scope.data = scope.validStoreInfo.reduce(function (data, item) {
                            return data.concat(item.storeNumber);
                        }, []);

                        scope.data.locations='stores';

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

                    function getStoresByIdEdit(data,clicked) {
                        var tempData = {};
                          //console.log('___data value in getStoreByID  fot Stores::',data);
                           // console.log("Inside Store DataService call..")
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

                    function getStoresByID(data, location, clicked) {

                        //console.log('___data value in getStoreByID ::',data,location,clicked);
                        var tempData = {};
                        var locationPromise = {};

                        if(location == 'stores' ) { 

                            // console.log('___data value in getStoreByID  fot Stores::',data);
                            //console.log("Inside Store DataService call..")
                            tempData.locationNumbers = locationDataService
                            .getStoreIds(data.locationNumbers)

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
                            // console.log('___data value in getStoreByID for Markets ::',data);
                            //console.log("Market selected to call Data service::",data.locationMarketNumbers)
                            tempData.locationNumbers=locationDataService
                            .getStoreIds(data.locationNumbers)
                               // console.log("__tempData.locationNumbers after service call ::"+tempData.locationNumbers);
                           
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
                        // getData();
                        //var location = 'stores';
                        //var location = 'markets';
                        //storeData.storeNumbers = scope.data;
                        storeData.locationNumbers = scope.data;
                        //marketData.locationMarketNumbers = scope.data
                        //console.log("Store Scope Data to getStoreIds::" +  JSON.stringify(storeData));
                       // console.log("Market Scope Data to getStoreIds::" +  JSON.stringify(marketData));
                        //getStoresByID(storeData, location, true)
                        //getStoresByID(marketData, location, true)
                        getStoresByIdEdit(storeData, true)
                    }

                    scope.searchResults = [];

                    scope.removePromoCode = function (index) {
                        scope.validStoreInfo.splice(index, 1);
                        setData();
                    }

                    scope.search = function (data,location) {

                        if(location =='stores' ) {
                           // console.log("__#_#_#_#_#__Location selected is::"+location)
                            
                            if (!data || data == null || data == '') {
                                DataFactory.messageModal.message = 'Please enter a valid Store Number';
                                DataFactory.messageModal.title = 'Warning';
                                $('#messageModal').popup();
                            } else {

                           // console.log("____Store ELSE ");
                                data = data.replace(/\s\s+/g, ' ')
                            .split(/[',',' ',', ']+/);

                                filterStoreData(data);
                                validateStoreData(data);
                            //console.log("Successfull till validateStoreData")
                                storeData.locationNumbers = data;

                                if (!scope.showInvalidError) {
                                //console.log("__Stores Search after validations storeData is::"+JSON.stringify(storeData))
                               // console.log("___ Json value::"+scope.data);
                                    getStoresByID(storeData, location, true);
                                }
                            }

                        }

                       // else if(location =='markets' )  {
                        else {
                            if (!data || data == null || data == '') {
                                DataFactory.messageModal.message = 'Please enter a valid Market Number';
                                DataFactory.messageModal.title = 'Warning';
                                $('#messageModal').popup();
                            } else {
                                data = data.replace(/\s\s+/g, ' ')
                                .split(/[',',' ',', ']+/);

                                filterStoreData(data);
                                validateStoreData(data);
                           // storeData.locationNumbers = data;
                                storeData.locationNumbers = data;
                           //marketData.locationMarketNumbers = data;
                              
                                if (!scope.showInvalidError) {
                               // console.log("__Market Search after Validations storeData is::"+JSON.stringify(marketData))
                                //getStoresByID(marketData, location, true);
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
