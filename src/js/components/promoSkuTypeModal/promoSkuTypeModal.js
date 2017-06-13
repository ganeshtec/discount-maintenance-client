app.component('promoSkuTypeModal', {
    bindings: {
        skuIdValidationResponse: '=',
        filteredSkuListCallback: '&'
    },
    templateUrl: 'promoSkuTypeModal.html',
    controller: PromoSkuTypeModalController,
});

function PromoSkuTypeModalController(skuTypesDataService, $mdDialog) {
    var ctrl = this;
    ctrl.$onInit = function () {
        skuTypesDataService.fetchSkuTypes().then(function (skuTypes) {
            ctrl.skuTypes = skuTypes;
            //var ctr = 0;
            var skuTypeCode;
            var skuCountList = ctrl.skuIdValidationResponse.skuCountList;
            ctrl.skuSelectionMap = {}
            for (var i = 0, len = ctrl.skuTypes.length; i < len; i++) {
                skuTypeCode = ctrl.skuTypes[i].skuTypeCode;
                ctrl.skuSelectionMap[skuTypeCode] = { count: 0, selected: false };
            }
            for (var j = 0; j < skuCountList.length; j++) {
                skuTypeCode = skuCountList[j].skuTypeCode;
                ctrl.skuSelectionMap[skuTypeCode].count = skuCountList[j].skuCount;
                ctrl.skuSelectionMap[skuTypeCode].selected = true;
            }
        });
    }

    ctrl.closeSkuTypeModal = function () {
        $mdDialog.hide();
    }

    ctrl.filterSkuTypesUnchecked = function () {
        var filteredList = [];
        for (var i = 0; i < ctrl.skuIdValidationResponse.validSkuInfo.length; i++) {
            var skuInfo = ctrl.skuIdValidationResponse.validSkuInfo[i];
            if (ctrl.skuSelectionMap[skuInfo.skuTypeCode].selected) {
                filteredList.push(skuInfo);
            }
        }
        ctrl.skuIdValidationResponse.validSkuInfo=filteredList;
        $mdDialog.hide();
        ctrl.filteredSkuListCallback({ filteredResult: ctrl.skuIdValidationResponse});
             
    }

}