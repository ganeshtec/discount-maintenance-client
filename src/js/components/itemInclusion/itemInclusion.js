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
ItemInclusionsController.$inject = ['itemsDataService', 'DataFactory', '$mdDialog', '$scope'];
function ItemInclusionsController(itemsDataService, DataFactory, $mdDialog, $scope) {
    var ctrl = this;
    var omsData = {};
    var skuData = {};
    this.existingID = '';

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
                ctrl.getItemsByID(skuData);
            } else {
                omsData.omsIds = ctrl.data;
                ctrl.getItemsByID(omsData);
            }
        }
        ctrl.searchResults = [];
    }
    ctrl.$onChanges = function (changes) {
        if (changes.purchaseoption.currentValue === 'itemsku') {
            ctrl.isSkuSearch = true;
        } else {
            ctrl.isSkuSearch = false;
        }
    }
    this.addItem = function (item) {
        if (!ctrl.data) {
            ctrl.data = [];
        }
        if (ctrl.data.indexOf(item.omsId) === -1) {
            ctrl.validOmsInfo.push(item);
            ctrl.setData();
        } else {
            this.existingID += item.omsId + ', ';
        }

    }

    this.addSku = function (sku) {
        if (!ctrl.data) {
            ctrl.data = [];
        }
        if (ctrl.data.indexOf(sku.skuNumber) === -1) {
            ctrl.validSkuInfo.push(sku);
            ctrl.setSkuData();
        } else {
            this.existingID += sku.skuNumber + ', ';

        }

    }

    this.setData = function () {
        ctrl.itemtype = 'OMS';
        ctrl.data = ctrl.validOmsInfo.reduce(function (data, item) {
            return data.concat(item.omsId);
        }, []);
    }

    this.setSkuData = function () {
        ctrl.itemtype = 'SKU';
        ctrl.data = ctrl.validSkuInfo.reduce(function (data, sku) {
            return data.concat(sku.skuNumber);
        }, []);
    }

    this.setItemData = function (data, clicked) {
        this.existingID = '';
        if (!ctrl.validOmsInfo.length && ctrl.data && !ctrl.itemSearch) {
            $.extend(true, ctrl.validOmsInfo, data.validOmsInfo);
        }
        if (data.validOmsInfo && ctrl.itemSearch) {
            for (var i = 0; i < data.validOmsInfo.length; i++) {
                ctrl.addItem(data.validOmsInfo[i]);
            }
            if (this.existingID != '') {
                DataFactory.messageModal.message = 'Following item/s are already added: ' + this.existingID
                DataFactory.messageModal.title = 'Warning';
                $('#messageModal').popup();
            }
        }
    }

    this.handleInvalidItems = function(data,clicked) {
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

    this.setSkuValidData = function (data, clicked) {
        this.existingID = '';
        if (!ctrl.validSkuInfo.length && ctrl.data && !ctrl.itemSkuSearch) {
            $.extend(true, ctrl.validSkuInfo, data.validSkuInfo);
        }

        if (data.validSkuInfo && ctrl.itemSkuSearch) {
            for (var i = 0; i < data.validSkuInfo.length; i++) {
                ctrl.addSku(data.validSkuInfo[i]);
            }
            if (this.existingID != '') {
                DataFactory.messageModal.message = 'Following Sku/s are already added: ' + this.existingID
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

    this.getItemsByID = function (data, clicked) {

        if (ctrl.isSkuSearch) {

            var tempSkuData = {};

            tempSkuData.skuNumbers = itemsDataService.getSkuIDs(data.skuIds)

            var skuIdValidationPromise = itemsDataService.getSkuIdCodes(tempSkuData);

            skuIdValidationPromise.then(
                function (skuIdValidationResponse) {
                    DataFactory.messageModal.message = undefined;
                    if (skuIdValidationResponse.validSkuInfo && clicked != undefined && !DataFactory.messageModal.message) {
                        ctrl.showSkuTypeModal(skuIdValidationResponse);
                    } else {
                        ctrl.setSkuValidData(skuIdValidationResponse, clicked);
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
                    ctrl.setItemData(data, clicked);
                    ctrl.handleInvalidItems(data,clicked);
                },
                function (error) {
                    DataFactory.messageModal.message = error;
                    DataFactory.messageModal.title = 'Error';
                    $('#messageModal').popup();
                });
        }

    }

    this.showSkuTypeModal = function (skuIdValidationResponse) {
        var localScope = $scope.$new();
        localScope.skuIdValidationResponse = skuIdValidationResponse;
        $mdDialog.show({
            template: '<promo-sku-type-modal sku-id-validation-response="skuIdValidationResponse" filtered-sku-list-callback="$ctrl.filterSkuListCallback(filteredResult)"></promo-sku-type-modal>',
            parent: angular.element(document.body),
            scope: localScope,
            preserveScope: true
        })
    }

    ctrl.filterSkuListCallback = function (filteredResult) {
        ctrl.setSkuValidData(filteredResult, true);
    }
    ctrl.validateItemData = function (data) {
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
            ctrl.setSkuData();
        } else {
            ctrl.validOmsInfo.splice(index, 1);
            ctrl.setData();
        }

    }

    this.emptyCheck = function (data) {
        if (!data || data == null || data == '') {
            return true;
        }
    }

    ctrl.search = function (data) {
        if (ctrl.emptyCheck(data)) {
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
                ctrl.validateItemData(data);
                skuData.skuIds = data;
            } else {
                ctrl.dataEmpty = false;
                data = data.replace(/\s\s+/g, ' ').split(/[',',' ',', ']+/);
                ctrl.validateItemData(data);
                omsData.omsIds = data;

            }

        if (!ctrl.showInvalidError && !ctrl.dataEmpty) {
            if (ctrl.isSkuSearch) {
                ctrl.getItemsByID(skuData, true);
            } else {
                ctrl.getItemsByID(omsData, true);
            }
        }

    }
    ctrl.removeAll = function () {
        if (ctrl.isSkuSearch) {
            ctrl.validSkuInfo = [];
            ctrl.setSkuData();
        } else {
            ctrl.validOmsInfo = [];
            ctrl.setData();
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
