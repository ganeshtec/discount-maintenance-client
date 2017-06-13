// Purpose is to build promotion data.
app.component('itemInclusion', {
    //'itemsDataService', 'DataFactory', '$mdDialog',
    // function (itemsDataService, DataFactory, $mdDialog) {
    //     return {
    //         restrict: 'E',
    templateUrl: 'itemInclusion.html',
    bindings: {
        data: '=',
        purchaseoption: '<',
        itemtype: '=',
        promoform: '=',
        isDisabled: '=',
        viewProp: '='
    },
    controller: ItemInclusionsController
});
ItemInclusionsController.$inject = ['itemsDataService', 'DataFactory', '$mdDialog','$scope'];
function ItemInclusionsController(itemsDataService, DataFactory, $mdDialog,$scope) {
    var ctrl = this;
    var omsData = {};
    var skuData = {};
    var existingID = '';

    ctrl.$onInit = function () {
        ctrl.searchResults = [];
        ctrl.isSkuSearch = false;
        ctrl.validOmsInfo = [];
        ctrl.validSkuInfo = [];
        ctrl.inValidOmsInfo = false;
        ctrl.inValidSkuInfo = false;
        ctrl.showInvalidError = false;
        if (ctrl.data && ctrl.data.length) {
            if (ctrl.itemtype == 'SKU') {
                ctrl.isSkuSearch = true;
            }
            if (ctrl.isSkuSearch) {
                skuData.skuIds = ctrl.data;
                getItemsByID(skuData);
            } else {
                omsData.omsIds = ctrl.data;
                getItemsByID(omsData);
            }
        }
        ctrl.searchResults = [];
    }
    ctrl.$onChanges =function(changes){
        if (changes.purchaseoption.currentValue === 'itemsku') {
            ctrl.isSkuSearch = true;
        } else {
            ctrl.isSkuSearch = false;
        }
    }
    function addItem(item) {

        if (!ctrl.data) {
            ctrl.data = [];
        }
        if (ctrl.data.indexOf(item.omsId) === -1) {
            ctrl.validOmsInfo.push(item);
            setData();
        } else {
            existingID += item.omsId + ', ';
            DataFactory.messageModal.message = 'Following item/s are already added: ' + existingID
            DataFactory.messageModal.title = 'Warning';
            $('#messageModal').popup();
        }

    }

    function addSku(sku) {

        if (!ctrl.data) {
            ctrl.data = [];
        }
        if (ctrl.data.indexOf(sku.skuNumber) === -1) {
            ctrl.validSkuInfo.push(sku);
            setSkuData();
        } else {
            existingID += sku.skuNumber + ', ';

        }

    }

    function setData() {
        ctrl.itemtype = 'OMS';
        ctrl.data = ctrl.validOmsInfo.reduce(function (data, item) {
            return data.concat(item.omsId);
        }, []);
    }

    function setSkuData() {
        ctrl.itemtype = 'SKU';
        ctrl.data = ctrl.validSkuInfo.reduce(function (data, sku) {
            return data.concat(sku.skuNumber);
        }, []);
    }

    function setItemData(data, clicked) {
        existingID = '';

        if (!ctrl.validOmsInfo.length && ctrl.data && !ctrl.itemSearch) {
            $.extend(true, ctrl.validOmsInfo, data.validOmsInfo);
        }

        if (data.validOmsInfo && ctrl.itemSearch) {

            for (var i = 0; i < data.validOmsInfo.length; i++) {
                addItem(data.validOmsInfo[i]);
            }
        }

        // if invalid Data set to item search
        ctrl.itemSearch = (data.inValidOmsInfo) ? data.inValidOmsInfo.toString().replace(/,/g, ' ') : '';
        ctrl.inValidOmsInfo = (ctrl.itemSearch.length > 0);
        var invalidIds = data.inValidOmsInfo;
        if (clicked && invalidIds && invalidIds.length > 0) {
            DataFactory.messageModal.message = 'Following Items/OMS ID\'s are invalid: ' + invalidIds.toString();
            DataFactory.messageModal.title = 'Warning';
            $('#messageModal').popup();
        }
    }
    function setSkuValidData(data, clicked) {
        existingID = '';
        if (!ctrl.validSkuInfo.length && ctrl.data && !ctrl.itemSkuSearch) {
            $.extend(true, ctrl.validSkuInfo, data.validSkuInfo);
        }

        if (data.validSkuInfo && ctrl.itemSkuSearch) {
            for (var i = 0; i < data.validSkuInfo.length; i++) {
                addSku(data.validSkuInfo[i]);
            }
            if (existingID != '') {
                DataFactory.messageModal.message = 'Following Sku/s are already added: ' + existingID
                DataFactory.messageModal.title = 'Warning';
                $('#messageModal').popup();
            }
        }
        // if invalid Data set to item search
        ctrl.itemSkuSearch = (data.inValidSkuInfo) ? data.inValidSkuInfo.toString().replace(/,/g, ' ') : '';
        ctrl.inValidSkuInfo = (ctrl.itemSkuSearch.length > 0);
        var invalidIds = data.inValidSkuInfo;
        if (clicked && invalidIds && invalidIds.length > 0) {
            ctrl.showInvalidError = true;

        }
    }

    function getItemsByID(data, clicked) {

        if (ctrl.isSkuSearch) {

            var tempSkuData = {};

            tempSkuData.skuNumbers = itemsDataService.getSkuIDs(data.skuIds)

            var skuIdValidationPromise = itemsDataService.getSkuIdCodes(tempSkuData);

            skuIdValidationPromise.then(
                function (skuIdValidationResponse) {
                    DataFactory.messageModal.message = undefined;
                    if (skuIdValidationResponse.validSkuInfo && clicked != undefined && !DataFactory.messageModal.message) {
                        showSkuTypeModal(skuIdValidationResponse);
                    }else{
                        setSkuValidData(skuIdValidationResponse, clicked);
                    }
                },
                function (error) {
                    DataFactory.messageModal.message = error;
                    DataFactory.messageModal.title = 'Error';
                    $('#messageModal').popup();
                });
        } else {

            var tempData = {};
            tempData.omsIds = itemsDataService.getOmsIDs(data.omsIds)
            var itemPromise = itemsDataService.getOmsIdCodes(tempData);

            itemPromise.then(
                function (data) {
                    setItemData(data, clicked);
                },
                function (error) {
                    DataFactory.messageModal.message = error;
                    DataFactory.messageModal.title = 'Error';
                    $('#messageModal').popup();
                });
        }

    }

    function showSkuTypeModal(skuIdValidationResponse) {
        var localScope=$scope.$new();
        localScope.skuIdValidationResponse = skuIdValidationResponse;
        $mdDialog.show({
            template: '<promo-sku-type-modal sku-id-validation-response="skuIdValidationResponse" filtered-sku-list-callback="$ctrl.filterSkuListCallback(filteredResult)"></promo-sku-type-modal>',
            parent: angular.element(document.body),
            scope: localScope,
            preserveScope: true
        })
    }

    ctrl.filterSkuListCallback = function(filteredResult){
        setSkuValidData(filteredResult, true);
    }
    function validateItemData(data) {
        if (data.length == 0) {
            ctrl.showInvalidError = true;
            return;
        }

        for (var i = 0; i < data.length; i++) {
            if (/\s/g.test(data[i]) || /[a-z]/i.test(data[i])) {

                ctrl.showInvalidError = true;
                return;
            }
            if (!ctrl.isSkuSearch && data[i] && data[i].length != 9) {
                ctrl.showInvalidError = true;
                return;
            }
            ctrl.showInvalidError = false;
        }
    }
    ctrl.removePromoCode = function (index) {
        if (ctrl.isSkuSearch) {
            ctrl.validSkuInfo.splice(index, 1);
            setSkuData();
        } else {
            ctrl.validOmsInfo.splice(index, 1);
            setData();
        }

    }

    function emptyCheck(data) {
        if (!data || data == null || data == '') {
            return true;
        }
    }

    ctrl.search = function (data) {
        if (emptyCheck(data)) {
            if (ctrl.isSkuSearch) {
                ctrl.dataEmpty = true;
                DataFactory.messageModal.message = 'Please enter atleast one valid SKU Number to continue';
                DataFactory.messageModal.title = 'Warning';
                $('#messageModal').popup();
            } else {
                ctrl.dataEmpty = true;
                DataFactory.messageModal.message = 'Please enter Valid OMS Number';
                DataFactory.messageModal.title = 'Warning';
                $('#messageModal').popup();

            }
        } else
            if (ctrl.isSkuSearch) {
                ctrl.dataEmpty = false;
                data = data.replace(/\s\s+/g, ' ').split(/[',',' ',', ']+/);
                validateItemData(data);
                skuData.skuIds = data;
            } else {
                ctrl.dataEmpty = false;
                data = data.replace(/\s\s+/g, ' ').split(/[',',' ',', ']+/);
                validateItemData(data);
                omsData.omsIds = data;

            }

        if (!ctrl.showInvalidError && !ctrl.dataEmpty) {
            if (ctrl.isSkuSearch) {
                getItemsByID(skuData, true);
            } else {
                getItemsByID(omsData, true);
            }
        }

    }
    ctrl.removeAll = function () {
        if (ctrl.isSkuSearch) {
            ctrl.validSkuInfo = [];
            setSkuData();
        } else {
            ctrl.validOmsInfo = [];
            setData();
        }

    }
    ctrl.clear = function () {
        if (ctrl.isSkuSearch) {
            ctrl.inValidSkuInfo = false;
        } else {
            ctrl.inValidOmsInfo = false;
        }

    }
}
