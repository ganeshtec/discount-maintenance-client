// Purpose is to build promotion code spec.
app.component('qualifiers', {
    templateUrl: 'qualifiers.html',
    bindings: {
        data: '=',
        promoform: '=',
        preview: '=',
        isDisabled: '=',
        viewProp: '=',
        locations: '=',
        markets: '=',
        validationErrors: '='
    },
    controller: QualifiersController

});

function QualifiersController(MaxCouponGenerationLimit, customerSegmentDataService, utilService, validationService, featureFlagService, $scope, $rootScope, DataFactory, $filter, locationDataService, modalService, loginService) {
    var ctrl = this;
    var storeData = {};
    var marketData = {};
    var existingID = '';
    var existingMarketNumber = '';
    ctrl.$onInit = function () {
        ctrl.showBasketThreshold = $rootScope.showBasketThreshold;
        ctrl.showRapidPass = $rootScope.showRapidPass;
        ctrl.showAllProDiscount = $rootScope.showAllProDiscount;
        ctrl.discountEngineErrors = $rootScope.discountEngineErrors;
        ctrl.programIdForProMonthly = $rootScope.programIdForProMonthly;
        ctrl.displayCustomerSegmentInDCM = $rootScope.displayCustomerSegmentInDCM;
        ctrl.userType = loginService.getCurrentUserRole();

        ctrl.MaxCouponGenerationLimit = MaxCouponGenerationLimit;
        ctrl.data.locationType = '';
        ctrl.searchResults = [];
        ctrl.validStoreInfo = [];
        ctrl.validMarketInfo = [];
        ctrl.inValidStoreInfo = false;
        ctrl.showInvalidError = false;
        ctrl.addStoretest = ctrl.addStore;

        if (ctrl.data.purchaseConds && ctrl.data.purchaseConds.allProDiscount) {
            ctrl.clearRapidPassSelection();
        }

        // Add Mark
        ctrl.data.markets = ctrl.validMarketInfo;
        ctrl.data.stores = ctrl.validStoreInfo;
        ctrl.initialize();

        //This gets invoked for editing location data for existing promotion
        var clicked = true;
        if (ctrl.locations && ctrl.locations.length > 0) {
            ctrl.data.locationType = 'stores';
            storeData.locationNumbers = ctrl.locations;
            ctrl.getStoresByID(storeData, clicked)
        } else {
            ctrl.data.locationType = 'markets';
            if (ctrl.markets && ctrl.markets.length > 0) {
                marketData.locationNumbers = ctrl.markets;
                ctrl.getMarketsByID(marketData, clicked)
            }
        }

        ctrl.segmentDetails = [];
        if (!$rootScope.segmentsFromV2Endpoint) {
            var segmentsFromV1EndpointPromise = customerSegmentDataService.getAllSegments();
            segmentsFromV1EndpointPromise.then(
                function (data) {
                    angular.forEach(data.segments, function (segmentFromWebService) {
                        var segment = {};
                        segment.name = segmentFromWebService.name;
                        segment.id = segmentFromWebService.id;
                        ctrl.segmentDetails.push(segment);

                        // If condition for Edit Customer Segment
                        if (ctrl.data.purchaseConds.customerSegmentId && ctrl.data.purchaseConds.customerSegmentId == segmentFromWebService.id) {
                            ctrl.data.segment = segment;
                        }
                    });

                    if (ctrl.data.purchaseConds.allProDiscount) {
                        ctrl.data.segment = ctrl.segmentDetails[0];
                    }

                    if (!ctrl.data.segment) {
                        ctrl.data.purchaseConds.customerSegmentId = 0;
                    }
                }, function (error) { ctrl.discountEngineErrors.push(error); }
            );
        } else {
            var segmentsFromV2EndpointPromise = customerSegmentDataService.getAllSegmentsV2EndPoint();
            segmentsFromV2EndpointPromise.then(
                function (data) {
                    ctrl.segmentListfromWebservice = data.segments;
                    var arrayLength = ctrl.segmentListfromWebservice.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var segment = {};
                        segment.name = ctrl.segmentListfromWebservice[i].segmentName;
                        segment.id = ctrl.segmentListfromWebservice[i].segmentId;
                        segment.progId = ctrl.segmentListfromWebservice[i].programId;
                        segment.tierId = ctrl.segmentListfromWebservice[i].tierId;

                        // If condition for Edit Customer Segment
                        if (ctrl.data.purchaseConds.customerSegmentId || (ctrl.data.purchaseConds.program && ctrl.data.purchaseConds.program.id && ctrl.data.purchaseConds.program.tierId)) {
                            if ((ctrl.data.purchaseConds.customerSegmentId == ctrl.segmentListfromWebservice[i].segmentId) ||
                                (((ctrl.data.purchaseConds.program.id == ctrl.segmentListfromWebservice[i].programId)
                                    && (ctrl.data.purchaseConds.program.tierId == ctrl.segmentListfromWebservice[i].tierId)))) {
                                ctrl.data.segment = segment;
                            }
                        } else {
                            ctrl.data.purchaseConds.customerSegmentId = 0;
                            ctrl.data.purchaseConds.program = { id: 0, tierId: 0 };
                        }
                        ctrl.segmentDetails.push(segment);
                    }
                    if (ctrl.data.purchaseConds.allProDiscount) {
                        ctrl.data.segment = ctrl.segmentDetails[0];
                    }
                },
                function (error) {
                    ctrl.discountEngineErrors.push(error);
                }
            );
        }
    };

    ctrl.onSegmentSelection = function () {
        ctrl.data.purchaseConds.program = { proPaint: null };
        if (ctrl.data.segment) {
            if (ctrl.data.segment.id && ctrl.data.segment.id != -1) {
                ctrl.data.purchaseConds.customerSegmentId = ctrl.data.segment.id;
                ctrl.data.purchaseConds.allProDiscount = false;
                ctrl.data.purchaseConds.program = {};
                ctrl.validationErrors = validationService.validateRapidPass(ctrl.data);
                ctrl.clearRapidPassSelection();
            } else if (ctrl.data.segment.id && ctrl.data.segment.id == -1) {
                ctrl.data.purchaseConds.customerSegmentId = 0;
                ctrl.data.purchaseConds.allProDiscount = true;
                ctrl.clearRapidPassSelection();
            } else {

                ctrl.data.purchaseConds.customerSegmentId = 0;
            }
            if (ctrl.data.segment.progId) {

                ctrl.data.purchaseConds.program.id = ctrl.data.segment.progId;
            }
            else {
                ctrl.data.purchaseConds.program.id = 0;

            }
            if (ctrl.data.segment.tierId) {
                ctrl.data.purchaseConds.program.tierId = ctrl.data.segment.tierId;
            }
            else {
                ctrl.data.purchaseConds.program.tierId = 0;
            }
        } else {

            ctrl.data.purchaseConds.customerSegmentId = 0;
            ctrl.data.purchaseConds.program = {};
            ctrl.data.purchaseConds.program.id = 0;
            ctrl.data.purchaseConds.program.tierId = 0;
            ctrl.data.disableRapidPass = false;
            ctrl.validationErrors = validationService.validateRapidPass(ctrl.data);
        }
    };

    ctrl.showProPaintOptions = function () {
        if (ctrl.data.segment && ctrl.data.segment.progId && ctrl.programIdForProMonthly && (ctrl.programIdForProMonthly.split(',').indexOf(ctrl.data.segment.progId.toString()) > -1)) {
            return true;
        } else {
            return false;
        }
    };

    ctrl.updatePrintLabel = function () {
        utilService.updatePrintLabel(ctrl.data);
    };

    ctrl.validatePromotion = function () {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    };

    ctrl.clearRapidPassSelection = function () {
        if (ctrl.data.purchaseConds.allProDiscount) {
            if (ctrl.data.checkRapidPass) {
                modalService.showAlert('Warning', 'Rapid Pass selection removed due to selection of All Pros Customer Segment');
            }
            ctrl.data.checkRapidPass = false;
            ctrl.data.promoCdSpec = {};
            ctrl.data.promoCdRqrd = false;
            ctrl.data.disableRapidPass = true;
        } else {
            ctrl.data.disableRapidPass = false;
        }
    }

    ctrl.selectRapidPass = function () {
        if (ctrl.data.checkRapidPass) {
            
            var currentUniqueCdCnt = ctrl.data.promoCdSpec &&  ctrl.data.promoCdSpec.systemGen && ctrl.data.promoCdSpec.systemGen.uniqueCdCnt ? ctrl.data.promoCdSpec.systemGen.uniqueCdCnt : '';

            ctrl.data.promoCdSpec = {};
            ctrl.data.promoCdSpec.type = 'Private';
            ctrl.data.promoCdSpec.genType = 'Dynamically Generated';
            ctrl.data.promoCdSpec.cdLength = '12';
            ctrl.data.promoCdSpec.systemGen = {};
            ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = currentUniqueCdCnt;
            ctrl.data.promoCdSpec.systemGen.cdPrefix = (ctrl.data.segment && ctrl.data.segment.id && ctrl.data.segment.id > 0) ? '0100' + ctrl.data.segment.id : '0100';
            ctrl.data.promoCdSpec.systemGen.cdSuffix = '';
            ctrl.data.promoCdRqrd = true;

        }
        else {
            delete ctrl.data.promoCdSpec;
            ctrl.data.promoCdRqrd = false;
            ctrl.data.receiptHeader = '';
            ctrl.data.receiptDesc = '';
        }
    }

    ctrl.initialize = function () {
        if (ctrl.data.promoCdSpec && ctrl.data.promoCdSpec.genType === 'Dynamically Generated' && ctrl.data.promoCdSpec.systemGen) {
            ctrl.data.checkRapidPass = true;
            if (utilService.isPromotionActive(ctrl.data)) {
                ctrl.data.disableRapidPass = true;
            } else {
                ctrl.data.disableRapidPass = false;
            }
        }
        else {
            ctrl.data.checkRapidPass = false;
        }
    }

    ctrl.checkRapidPassCouponLimit = function () {
        return ctrl.data.promoCdSpec.systemGen.uniqueCdCnt > ctrl.MaxCouponGenerationLimit;
    }

    ctrl.search = function (data) {
        if (ctrl.checkForEmptyValues(data, ctrl.data.locationType)) {
            data = ctrl.formatToCommaSeparatedList(data);
            if (ctrl.isLocationDataValid(data)) {
                if (ctrl.data.locationType == 'stores') {
                    storeData.locationNumbers = data;
                    ctrl.getStoresByID(storeData, true);
                } else {
                    marketData.locationNumbers = data;
                    ctrl.getMarketsByID(marketData, true);
                }

            }
        }

    };

    ctrl.checkForEmptyValues = function (data, locationType) {
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

    ctrl.formatToCommaSeparatedList = function (data) {

        return data.replace(/\s\s+/g, ' ')
            .split(/[',',' ',', ']+/);
    }

    //Validates the input list for white spaces and alphanumeric characters
    ctrl.isLocationDataValid = function (data) {

        if (data.length == 0) {
            ctrl.showInvalidError = true;
            return false;
        }

        for (var i = 0; i < data.length; i++) {
            if (/\s/g.test(data[i]) ||
                /[a-z]/i.test(data[i])) {
                ctrl.showInvalidError = true;
                return false;
            }

            ctrl.showInvalidError = false;
            return true;
        }
    }

    ctrl.stripChars = function (data, stripLength) {
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
    ctrl.getMarketsByID = function (data, clicked) {
        var marketValidationResponsePromise = locationDataService
            .validateMarketIds(data);
        marketValidationResponsePromise
            .then(
                function (data) {
                    ctrl.setMarketData(data, clicked);
                },
                showErrorMessage
            );
    }

    /* Data Service Call for Store  Search  */
    ctrl.getStoresByID = function (data, clicked) {
        var locationPromise = locationDataService
            .getStoreIdCodes(data);
        locationPromise
            .then(
                function (data) {
                    ctrl.setStoreData(data,
                        clicked);
                },
                showErrorMessage);
    }

    ctrl.setMarketData = function (data, clicked) {
        existingMarketNumber = '';
        var invalidMarketNumbers;

        if (!ctrl.validMarketInfo.length && ctrl.markets && !ctrl.locationSearch) {
            $.extend(true,
                ctrl.validMarketInfo,
                data.validMarketInfo);
        }
        if (data.validMarketInfo && ctrl.locationSearch) {
            for (var i = 0; i < data.validMarketInfo.length; i++) {
                ctrl.addMarket(data.validMarketInfo[i]);
            }
        }
        invalidMarketNumbers = ctrl.checkForInvalidLocations(data);
        ctrl.printErrorMessageForInvalidLocations(invalidMarketNumbers, data, clicked);
    }

    ctrl.setStoreData = function (data, clicked) {
        existingID = '';
        var invalidIds;


        if (!ctrl.validStoreInfo.length && ctrl.locations && !ctrl.locationSearch) {
            $.extend(true,
                ctrl.validStoreInfo,
                data.validStoreInfo);
        }
        if (data.validStoreInfo &&
            ctrl.locationSearch) {
            for (var i = 0; i < data.validStoreInfo.length; i++) {
                ctrl.addStore(data.validStoreInfo[i]);
            }
        }
        invalidIds = ctrl.checkForInvalidLocations(data);
        ctrl.printErrorMessageForInvalidLocations(invalidIds, data, clicked);
    }

    ctrl.checkForInvalidLocations = function (data) {
        if (data.inValidStoreInfo) {
            ctrl.locationSearch = [data.inValidStoreInfo
                .toString().replace(/,/g, ' ')]
            ctrl.inValidStoreInfo = (ctrl.locationSearch.length > 0);
            return data.inValidStoreInfo;

        }
        else if (data.inValidMarketInfo) {
            ctrl.locationSearch = [data.inValidMarketInfo
                .toString().replace(/,/g, ' ')]
            ctrl.inValidMarketInfo = (ctrl.locationSearch.length > 0);
            return data.inValidMarketInfo;

        }
        else {
            ctrl.locationSearch = [];
            return [];
        }
    }

    ctrl.printErrorMessageForInvalidLocations = function (invalidIds, data, clicked) {
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
    ctrl.addStore = function (item) {

        if (!ctrl.locations) {
            ctrl.locations = [];
        }
        if (ctrl.locations.indexOf(item.storeNumber) === -1) {
            ctrl.validStoreInfo.push(item);
            setData();
        } else {
            existingID += item.storeNumber + ', ';
            DataFactory.messageModal.message = 'Following stores are already added: ' +
                existingID
            DataFactory.messageModal.title = 'Warning';
            $('#messageModal').popup();
        }

    }

    ctrl.addMarket = function (market) {

        if (!ctrl.markets) {
            ctrl.markets = [];
        }
        if (ctrl.markets.indexOf(market.marketNumber) === -1) {
            ctrl.validMarketInfo.push(market)
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
        ctrl.data.markets = ctrl.validMarketInfo;
        ctrl.markets = ctrl.validMarketInfo.reduce(function (data, market) {
            return data.concat(market.marketNumber);
        }, []);
    }

    function setData() {
        ctrl.data.stores = ctrl.validStoreInfo;
        ctrl.locations = ctrl.validStoreInfo.reduce(function (data, item) {
            return data.concat(item.storeNumber);
        }, []);
    }

    ctrl.removeMarket = function (marketNumber) {
        for (var i = 0; i < ctrl.validMarketInfo.length; i++) {
            if (ctrl.validMarketInfo[i].marketNumber === marketNumber) {
                ctrl.validMarketInfo.splice(i, 1);
                break;
            }
        }
        setMarketData();
    }

    ctrl.removeStore = function (storeNumber) {
        for (var i = 0; i < ctrl.validStoreInfo.length; i++) {
            if (ctrl.validStoreInfo[i].storeNumber === storeNumber) {
                ctrl.validStoreInfo.splice(i, 1);
                break;
            }
        }
        setData();
    }
    $rootScope.$on('clearSingleSkuBulk', function(){
        ctrl.removeAll()
    })

    //Removing all the stores listed
    ctrl.removeAll = function () {
        ctrl.validStoreInfo = [];
        ctrl.validMarketInfo = [];
        setData();
        setMarketData();
    }
    //Resetting invalid store info flag on clearing data
    ctrl.clear = function () {
        ctrl.inValidStoreInfo = false;
        ctrl.invalidMarketNumbers = false;
    }

    ctrl.clearInput = function () {
        ctrl.locationSearch = null;
        ctrl.showInvalidError = false;
    }
    // LOCATIONS END

    ctrl.sortStore = function (store){
        return parseInt(store.storeNumber);
    }
}
