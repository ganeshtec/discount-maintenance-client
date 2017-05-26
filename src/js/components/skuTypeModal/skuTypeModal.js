app.component('skuTypeModal', {
    bindings: {
        data: '=',
    },
    templateUrl: 'skuTypeModal.html',
    controller: SkuTypeModalController,
});

function SkuTypeModalController(skuTypesDataService,$mdDialog,$scope) {
    var ctrl=this;
    ctrl.isSkuTypeExcluded =function(skuTypeCode){
        
        var result=false;
        ctrl.data.purchaseConds.sources[0].exclusions.attrs.forEach(function(attr){          
            if(attr.value == skuTypeCode){
                result= true;
            }
        })
        return result;
    }
    ctrl.$onInit = function () {
        skuTypesDataService.fetchSkuTypes().then(function(skuTypes){
            ctrl.skuTypes=skuTypes;
            ctrl.skuSelection={};       
            ctrl.skuTypes.forEach(function(skuType) {
                ctrl.skuSelection[skuType.skuTypeCode]= !ctrl.isSkuTypeExcluded(skuType.skuTypeCode);
            });
        
            
        });
    }

    

    $scope.applySkuTypeSelection = function(){
        var attrs=[]
        ctrl.skuTypes.forEach(function(skuType){
            if(!ctrl.skuSelection[skuType.skuTypeCode]){
                var attr={};
                attr.value=skuType.skuTypeCode;
                attr.id='bcdfe1a4-626a-4042-9a2e-5298f9b952a8'
                attr.name='SKU Type';
                attr.operator='==';
                attrs.push(attr);
            }
        });
        ctrl.data.purchaseConds.sources[0].exclusions.attrs=attrs;
        $mdDialog.hide();
    }

    $scope.closeSkuTypeModal = function(){
        $mdDialog.hide();
    }

}
