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
                    locations: '=',
                    markets: '=',
                    promoform: '=',
                    preview: '=',
                },
                controller: function () {


                },
                link: function (scope) {
                    var storeData = {};
                    var marketData = {};
                    var existingID = '';
                    var existingMarketNumber = '';
                    scope.locationType = '';
                    scope.searchResults = [];
                    scope.validStoreInfo = [];
                    scope.validMarketInfo = [];
                    scope.inValidStoreInfo = false;
                    scope.showInvalidError = false;
                    scope.addStoretest = scope.addStore;

                    scope.search = function (data) {
                        if (scope.checkForEmptyValues(data, scope.locationType)) {
                            data = scope.formatToCommaSeparatedList(data);
                            if (scope.isLocationDataValid(data)) {
                                if (scope.locationType == 'stores') {
                                    storeData.locationNumbers = data;
                                    scope.getStoresByID(storeData, true);

                                } else {
                                    marketData.locationNumbers = data;
                                    scope.getMarketsByID(marketData, true);
                                }

                            }
                        }

                    }

                    scope.checkForEmptyValues = function (data, locationType) {
                        if (!data || data == null || data == '') {
                            if (locationType == 'stores') {
                                DataFactory.messageModal.message = 'Please enter a valid Store Number';
                            }
                            else {
                                DataFactory.messageModal.message = 'Please enter a valid Market Number';
                            }
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                            return false;
                        }
                        else {
                            return true;
                        }
                    }

                    scope.formatToCommaSeparatedList = function (data) {

                        return data.replace(/\s\s+/g, ' ')
                            .split(/[',',' ',', ']+/);
                    }

                    //Validates the input list for white spaces and alphanumeric characters
                    scope.isLocationDataValid = function (data) {

                        if (data.length == 0) {
                            scope.showInvalidError = true;
                            return false;
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (/\s/g.test(data[i]) ||
                                /[a-z]/i.test(data[i])) {
                                scope.showInvalidError = true;
                                return false;
                            }

                            scope.showInvalidError = false;
                            return true;
                        }
                    }

                    /* method added to ignore store values > 5 */

                    scope.stripChars = function (data, stripLength) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].length > stripLength) {
                                data.splice(i, 1);
                            }
                        }
                        return data;
                    }
                    var showErrorMessage = function (error) {
                        DataFactory.messageModal.message = error;
                        DataFactory.messageModal.title = 'Error';
                        $('#messageModal')
                            .popup();
                    };

                    /* Data Service Call for Market  Search  */
                    scope.getMarketsByID = function (data, clicked) {
                        var marketValidationResponsePromise = locationDataService
                            .validateMarketIds(data);
                        marketValidationResponsePromise
                            .then(
                            function (data) {
                                scope.setMarketData(data, clicked);
                            },
                            showErrorMessage
                            );
                    }

                    /* Data Service Call for Store  Search  */
                    scope.getStoresByID = function (data, clicked) {
                        var locationPromise = locationDataService
                            .getStoreIdCodes(data);
                        locationPromise
                            .then(
                            function (data) {
                                scope.setStoreData(data,
                                    clicked);
                            },
                            showErrorMessage);
                    }


                    scope.setMarketData = function (data, clicked) {
                        existingMarketNumber = '';
                        var invalidMarketNumbers;

                        if (!scope.validMarketInfo.length && scope.markets && !scope.locationSearch) {
                            $.extend(true,
                                scope.validMarketInfo,
                                data.validMarketInfo);
                        }
                        if (data.validMarketInfo && scope.locationSearch) {
                            for (var i = 0; i < data.validMarketInfo.length; i++) {
                                scope.addMarket(data.validMarketInfo[i]);
                            }
                        }
                        invalidMarketNumbers = scope.checkForInvalidLocations(data);
                        scope.printErrorMessageForInvalidLocations(invalidMarketNumbers, data, clicked);
                    }

                    scope.setStoreData = function (data, clicked) {
                        existingID = '';
                        var invalidIds;


                        if (!scope.validStoreInfo.length && scope.locations && !scope.locationSearch) {
                            $.extend(true,
                                scope.validStoreInfo,
                                data.validStoreInfo);
                        }
                        if (data.validStoreInfo &&
                            scope.locationSearch) {
                            for (var i = 0; i < data.validStoreInfo.length; i++) {
                                scope.addStore(data.validStoreInfo[i]);
                            }
                        }
                        invalidIds = scope.checkForInvalidLocations(data);
                        scope.printErrorMessageForInvalidLocations(invalidIds, data, clicked);
                    }

                    scope.checkForInvalidLocations = function (data) {
                        if (data.inValidStoreInfo) {
                            scope.locationSearch = [data.inValidStoreInfo
                                .toString().replace(/,/g, ' ')]
                            scope.inValidStoreInfo = (scope.locationSearch.length > 0);
                            return data.inValidStoreInfo;

                        }
                        else if (data.inValidMarketInfo) {
                            scope.locationSearch = [data.inValidMarketInfo
                                .toString().replace(/,/g, ' ')]
                            scope.inValidMarketInfo = (scope.locationSearch.length > 0);
                            return data.inValidMarketInfo;

                        }
                        else {
                            scope.locationSearch = [];
                            return [];
                        }
                    }

                    scope.printErrorMessageForInvalidLocations = function (invalidIds, data, clicked) {
                        var locationprint;
                        if (data.inValidStoreInfo) {
                            locationprint = 'store';
                        }
                        else if (data.inValidMarketInfo) {
                            locationprint = 'market';
                        }


                        if (clicked && invalidIds &&
                            invalidIds.length > 0) {
                            DataFactory.messageModal.message = 'Following ' + locationprint + ' numbers are invalid: ' +
                                invalidIds;
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                        }

                    }

                    /* Adding stores data to the table */
                    scope.addStore = function (item) {

                        if (!scope.locations) {
                            scope.locations = [];
                        }
                        if (scope.locations.indexOf(item.storeNumber) === -1) {
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

                    scope.addMarket = function (market) {

                        if (!scope.markets) {
                            scope.markets = [];
                        }
                        if (scope.markets.indexOf(market.marketNumber) === -1) {
                            scope.validMarketInfo.push(market)
                            setMarketData();
                        }
                        else {
                            existingMarketNumber += market.marketNumber + ', ';
                            DataFactory.messageModal.message = 'Following Markets are already added: ' + existingMarketNumber
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                        }

                    }
                    function setMarketData() {
                        scope.markets = scope.validMarketInfo.reduce(function (data, market) {
                            return data.concat(market.marketNumber);
                        }, []);
                    }
                    function setData() {
                        scope.locations = scope.validStoreInfo.reduce(function (data, item) {
                            return data.concat(item.storeNumber);
                        }, []);
                    }

                    //This gets invoked for editing location data for existing promotion

                    var clicked = true;
                    if (scope.locations && scope.locations.length > 0) {
                        scope.locationType = 'stores';
                        storeData.locationNumbers = scope.locations;
                        scope.getStoresByID(storeData, clicked)
                    }
                    else {
                        scope.locationType = 'markets';
                        if (scope.markets && scope.markets.length > 0) {
                            marketData.locationNumbers = scope.markets;
                            scope.getMarketsByID(marketData, clicked)
                        }
                    }

                    // if (scope.data && scope.data.length) {
                    //     var clicked = true;
                    //     if (scope.data.locations == 'stores') 
                    //         {
                    //         storeData.locationNumbers = scope.data;
                    //         getStoresByID(storeData, 'stores', clicked)
                    //     }
                    //     else{
                    //         marketData.locationNumbers = scope.data;
                    //          // here we need to start work on Monday
                    //         getStoresByID(marketData, 'markets', clicked)
                    //     }
                    // }

                    //Removing a individual store
                    scope.removeItem = function (index) {

                        if (scope.locationType == 'markets') {
                            scope.validMarketInfo.splice(index, 1);
                            setMarketData();
                        }
                        else {
                            scope.validStoreInfo.splice(index, 1);
                            setData();
                        }

                    }
                    //Removing all the stores listed
                    scope.removeAll = function () {
                        scope.validStoreInfo = [];
                        scope.validMarketInfo = [];
                        setData();
                        setMarketData();
                    }
                    //Resetting invalid store info flag on clearing data
                    scope.clear = function () {
                        scope.inValidStoreInfo = false;
                        scope.invalidMarketNumbers = false;
                    }

                    scope.clearInput = function () {
                        scope.locationSearch = null;
                        scope.showInvalidError = false;
                    }

                }
            };
        }
    ]);
