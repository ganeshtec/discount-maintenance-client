app.component('promoSkuTypeModal', {
    bindings: {
        data: '=',
    },
    templateUrl: 'promoSkuTypeModal.html',
    controller: PromoSkuTypeModalController,
});

function PromoSkuTypeModalController(skuTypesDataService, $mdDialog) {
    var ctrl = this;
    ctrl.$onInit = function () {
        skuTypesDataService.fetchSkuTypes().then(function (skuTypes) {
            ctrl.skuTypes = skuTypes;
            var ctr = 0;
            var skuMap = ctrl.data.skuCountList;
            for (var i = 0, len = ctrl.skuTypes.length; i < len; i++) {
                for (var j = 0; j < skuMap.length; j++) {
                    if (skuMap[j].skuTypeCode == skuTypes[i].skuTypeCode) {
                        ctr++;
                        skuTypes[i].skuCount = skuMap[j].skuCount;
                    }

                }
                if (ctr == 0) {
                    skuTypes[i].skuCount = 0;
                }
                ctr = 0;

                ctrl.skuTypes[i].skuTypeCode = skuTypes[i].skuTypeCode;
            }

            skuTypes.sort(function (a, b) {
                return b.skuCount - a.skuCount;
            });
        });
    }
    
    ctrl.closeSkuTypeModal = function () {
        $mdDialog.hide();
    }

}