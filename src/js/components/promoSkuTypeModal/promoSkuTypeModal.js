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
            //var skuMap = ctrl.data.skuCountList;
            var skuMap = ctrl.getSkuCount(ctrl.data);

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

    ctrl.getSkuCount = function(data){
        console.log("Sku count: ", ctrl.data.skuCountList);
        return ctrl.data.skuCountList;
            
    }
    ctrl.applySkuTypeSelection = function () {
        // var attrs=[]
        // ctrl.skuTypes.forEach(function(skuType){
        //     if(!ctrl.skuSelection[skuType.skuTypeCode]){
        //         attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
        //    }
        // });
        // ctrl.data.purchaseConds.sources[0].exclusions.attrs=attrs;
        // $mdDialog.hide();
    }

    ctrl.closeSkuTypeModal = function () {
        $mdDialog.hide();
    }

}