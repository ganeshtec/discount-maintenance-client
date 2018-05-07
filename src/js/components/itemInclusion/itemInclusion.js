// Purpose is to build promotion data.
app.component('itemInclusion', {
    templateUrl: 'itemInclusion.html',
    bindings: {
        partnumbersparent: '=',
        purchaseoption: '<',
        itemtype: '=',
        promoform: '=',
        isDisabled: '=',
        viewProp: '=',
        showSkuTypeFilter: '=',
        preview: '=',
    },
    controller: ItemInclusionsController
});
function ItemInclusionsController(itemsDataService, DataFactory, $mdDialog, $scope,skuTypesDataService) {
    var ctrl = this;
    var omsData = {};
    var skuData = {};
    ctrl.$onInit = function () {
        ctrl.searchResults = [];
        ctrl.existingID = '';
        ctrl.skuTypeDescriptionLookup = {};
        ctrl.initializeSkuSearch(ctrl.purchaseoption);
        ctrl.partnumbersparent.validOmsInfo = [];
        ctrl.partnumbersparent.validSkuInfo = [];
        ctrl.inValidOmsInfo = false;
        ctrl.inValidSkuInfo = false;
        ctrl.showInvalidError = false;
        if (ctrl.partnumbersparent.partnumbers && ctrl.partnumbersparent.partnumbers.length) {
            if (ctrl.itemtype == 'SKU') {
                ctrl.isSkuSearch = true;
            }
            if (ctrl.isSkuSearch) {
                skuData.skuIds = ctrl.partnumbersparent.partnumbers;
                ctrl.getItemsByID(skuData);
            } else {
                omsData.omsIds = ctrl.partnumbersparent.partnumbers;
                ctrl.getItemsByID(omsData);
            }
        }
        ctrl.searchResults = [];
        skuTypesDataService.fetchSkuTypes().then(
            function(skuTypes){
                for(var i=0;i<skuTypes.length;i++){
                    ctrl.skuTypeDescriptionLookup[skuTypes[i].skuTypeCode]=skuTypes[i].description;
                }
            }
        );

    }
    ctrl.$onChanges = function (changes) {
        ctrl.initializeSkuSearch(changes.purchaseoption.currentValue);
        
        if(changes.purchaseoption.currentValue!='itemoms' && changes.purchaseoption.previousValue=='itemoms'){
            ctrl.partnumbersparent.validOmsInfo = [];
        }
        if(changes.purchaseoption.currentValue!='itemsku' && changes.purchaseoption.previousValue=='itemsku'){
            ctrl.partnumbersparent.validSkuInfo = [];
        }

    }
    ctrl.initializeSkuSearch = function (purchaseoption){
        ctrl.isSkuSearch=purchaseoption ==='itemsku';
    }
    this.addItem = function (item) {
        if (!ctrl.partnumbersparent.partnumbers) {
            ctrl.partnumbersparent.partnumbers = [];
        }
        if (!ctrl.partnumbersparent.validOmsInfo) {
            ctrl.partnumbersparent.validOmsInfo = [];
        }
        if (ctrl.partnumbersparent.partnumbers.indexOf(item.omsId) === -1) {
            ctrl.partnumbersparent.validOmsInfo.push(item);
            ctrl.setData();
        } else {
            this.existingID += item.omsId + ', ';
        }

    }

    this.addSku = function (sku) {
        if (!ctrl.partnumbersparent.partnumbers) {
            ctrl.partnumbersparent.partnumbers = [];
        }
        if (!ctrl.partnumbersparent.validSkuInfo) {
            ctrl.partnumbersparent.validSkuInfo = [];
        }
        if (ctrl.partnumbersparent.partnumbers.indexOf(sku.skuNumber) === -1) {
            ctrl.partnumbersparent.validSkuInfo.push(sku);
            ctrl.setSkuData();
        } else {
            this.existingID += sku.skuNumber + ', ';

        }

    }

    this.setData = function () {
        ctrl.itemtype = 'OMS';
        ctrl.partnumbersparent.partnumbers = ctrl.partnumbersparent.validOmsInfo.reduce(function (data, item) {
            return data.concat(item.omsId);
        }, []);
    }

    this.setSkuData = function () {
        ctrl.itemtype = 'SKU';
        ctrl.partnumbersparent.partnumbers = ctrl.partnumbersparent.validSkuInfo.reduce(function (data, sku) {
            return data.concat(sku.skuNumber);
        }, []);
    }

    this.setItemData = function (data) {
        this.existingID = '';
        if (!ctrl.partnumbersparent.validOmsInfo) {
            ctrl.partnumbersparent.validOmsInfo = [];
        }
        var condensedList = this.condenseMultipleSkus(data.validOmsInfo);
        if ((!ctrl.partnumbersparent.validOmsInfo || !ctrl.partnumbersparent.validOmsInfo.length) && ctrl.partnumbersparent.partnumbers && !ctrl.itemSearch) {
            $.extend(true, ctrl.partnumbersparent.validOmsInfo, condensedList);
        }
        if (data.validOmsInfo && ctrl.itemSearch) {
            for (var i = 0; i < condensedList.length; i++) {
                ctrl.addItem(condensedList[i]);
            }
            if (this.existingID != '') {
                ctrl.showMessageModal('Warning','Following item/s are already added: ' + this.existingID);
            }
        }
    }

    this.condenseMultipleSkus= function(data){
        var map={};
        if(data!=undefined){
            for (var i = 0; i < data.length; i++) {
                if(map[data[i].omsId]==undefined){
                    map[data[i].omsId]=data[i];
                }else{
                    map[data[i].omsId].skuNumber+=' '+data[i].skuNumber;
                }
            }
        }
        var keys = Object.keys(map); 
        var values = keys.map(function(v) { return map[v]; });
        return values;
    }

    this.showMessageModal =function (title, message){
        DataFactory.messageModal.title=title;
        DataFactory.messageModal.message =message;
        $('#messageModal').popup();
    }

    this.handleInvalidItems = function(data,clicked) {
            // if invalid Data set to item search
        ctrl.itemSearch = (data.inValidOmsInfo) ? data.inValidOmsInfo.toString().replace(/,/g, ' ') : '';
        ctrl.inValidOmsInfo = (ctrl.itemSearch.length > 0);
        var invalidIds = data.inValidOmsInfo;
        if (clicked && invalidIds && invalidIds.length > 0) {
            ctrl.showMessageModal('Warning','Following Items/OMS ID\'s are invalid: ' + invalidIds.toString());
        }
    }

    this.setSkuValidData = function (data, clicked) {
        this.existingID = '';
        if ((!ctrl.partnumbersparent.validSkuInfo || !ctrl.partnumbersparent.validSkuInfo.length) && ctrl.partnumbersparent.partnumbers && !ctrl.itemSkuSearch) {
            $.extend(true, ctrl.partnumbersparent.validSkuInfo, data.validSkuInfo);
        }

        if (data.validSkuInfo && ctrl.itemSkuSearch) {
            for (var i = 0; i < data.validSkuInfo.length; i++) {
                ctrl.addSku(data.validSkuInfo[i]);
            }
            if (this.existingID != '') {
                ctrl.showMessageModal('Warning','Following Sku/s are already added: ' + this.existingID);
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
                    if (ctrl.showSkuTypeFilter && skuIdValidationResponse.validSkuInfo && clicked != undefined && !DataFactory.messageModal.message) {
                        ctrl.showSkuTypeModal(skuIdValidationResponse);
                    } else {
                        ctrl.setSkuValidData(skuIdValidationResponse, clicked);
                    }
                },
                function (error) {
                    ctrl.showMessageModal('Error',error);
                });
        } else {

            var tempData = {};
            tempData.omsIds = itemsDataService.getOmsIDs(data.omsIds)
            var itemPromise = itemsDataService.getOmsIdCodes(tempData);

            itemPromise.then(
                function (data) {
                    ctrl.setItemData(data);
                    ctrl.handleInvalidItems(data,clicked);
                },
                function (error) {
                    ctrl.showMessageModal('Error',error);
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
            ctrl.partnumbersparent.validSkuInfo.splice(index, 1);
            ctrl.setSkuData();
        } else {
            ctrl.partnumbersparent.validOmsInfo.splice(index, 1);
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
            ctrl.partnumbersparent.validSkuInfo = [];
            ctrl.setSkuData();
        } else {
            ctrl.partnumbersparent.validOmsInfo = [];
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
