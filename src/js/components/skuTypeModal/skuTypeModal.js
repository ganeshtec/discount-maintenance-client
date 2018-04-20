app.component('skuTypeModal', {
    bindings: {
        source: '='
    },
    scope: {},
    templateUrl: 'skuTypeModal.html',
    controller: SkuTypeModalController,
});

function SkuTypeModalController(skuTypesDataService, $mdDialog) {
    var ctrl = this;
    ctrl.isSkuTypeExcluded = function (skuTypeCode) {
        var result = false;
        for(var index in ctrl.source.exclusions.attrs){
            if(ctrl.source.exclusions.attrs[index].value == skuTypeCode){
                result = true;
                break;
            }
        }
        return result;
    }
    ctrl.initializeSkuTypeExclusions = function () {
        if(ctrl.source.exclusions.initializeSkuTypeExclusions){
            var attrs = [];
            for(var index in ctrl.skuTypes){
                attrs.push(ctrl.buildSkuTypeAttr(ctrl.skuTypes[index].skuTypeCode));
            }
            ctrl.source.exclusions.attrs = attrs;
            ctrl.source.exclusions.initializeSkuTypeExclusions = false;
        }
    }
    ctrl.$onInit = function () {
        if (ctrl.source.exclusions == undefined) {
            ctrl.source.exclusions = {};
        }
        if (ctrl.source.exclusions.attrs == undefined) {
            ctrl.source.exclusions.attrs = [];
        }
        ctrl.skuSelection = {};
        skuTypesDataService.fetchSkuTypes().then(function (skuTypes) {
            ctrl.skuTypes = skuTypes;
            ctrl.initializeSkuTypeExclusions();
            for(var index in ctrl.skuTypes){
                var skuType=ctrl.skuTypes[index];
                ctrl.skuSelection[skuType.skuTypeCode] = !ctrl.isSkuTypeExcluded(skuType.skuTypeCode);
            }
            ctrl.updateSelectionMade();
        });       
    }
    ctrl.buildSkuTypeAttr = function (skuTypeCode) {
        var attr = {};
        attr.value = skuTypeCode;
        attr.id = 'bcdfe1a4-626a-4042-9a2e-5298f9b952a8'
        attr.name = 'SKU Type';
        attr.operator = '==';
        return attr;
    }



    ctrl.applySkuTypeSelection = function () {
        var attrs = [], selectedSku='';
        ctrl.skuTypes.forEach(function (skuType) {
            if (ctrl.skuSelection[skuType.skuTypeCode]) {
                selectedSku += ', ' + skuType.skuTypeCode;
            } else {    
                attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
            }
        });
        ctrl.source.selectedSku = selectedSku.length > 0 ? selectedSku.substring(1): '';  
        ctrl.source.exclusions.attrs = attrs;
        $mdDialog.hide();
    }

    ctrl.closeSkuTypeModal = function () {
        $mdDialog.hide();
    }

    ctrl.updateSelectionMade = function () {
        var result=false;
        if (ctrl.skuSelection  && ctrl.skuTypes) {
            for(var index in ctrl.skuTypes ){
                if (ctrl.skuSelection[ctrl.skuTypes[index].skuTypeCode] === true) {
                    result = true;
                    break;
                }
            }
        }       
        ctrl.selectionMade=result;  
    }

}
