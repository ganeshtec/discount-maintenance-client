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
    ctrl.isSkuTypeExclusionsNotInitialized = function(){
        var result = false;
        if(ctrl.data.status == '20' && !ctrl.data.purchaseConds.sources[0].exclusions.skuTypeAttrsInitialized){
            result=true;
        }
        return result;
    }
    ctrl.initializeSkuTypeExclusions = function(){
        var attrs=[];
        ctrl.skuTypes.forEach(function(skuType){
            attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
        });
        ctrl.data.purchaseConds.sources[0].exclusions.attrs=attrs;
        ctrl.data.purchaseConds.sources[0].exclusions.skuTypeAttrsInitialized=true;
    }

    ctrl.$onInit = function () {
        if(ctrl.data.purchaseConds.sources[0].exclusions == undefined){
            ctrl.data.purchaseConds.sources[0].exclusions={};           
        }
        if(ctrl.data.purchaseConds.sources[0].exclusions.attrs == undefined){
            ctrl.data.purchaseConds.sources[0].exclusions.attrs=[];
        }
        skuTypesDataService.fetchSkuTypes().then(function(skuTypes){
            ctrl.skuTypes=skuTypes;
            ctrl.skuSelection={};     
            if(ctrl.isSkuTypeExclusionsNotInitialized()){
                ctrl.initializeSkuTypeExclusions();                
            }
            ctrl.skuTypes.forEach(function(skuType) {
                    ctrl.skuSelection[skuType.skuTypeCode]=  !ctrl.isSkuTypeExcluded(skuType.skuTypeCode);
            });
            
            
        });
    }
    ctrl.buildSkuTypeAttr= function(skuTypeCode){
        var attr={};
        attr.value=skuTypeCode;
        //attr.id='bcdfe1a4-626a-4042-9a2e-5298f9b952a8'
        attr.id='bcdfe1a4';
        attr.name='SKU Type';
        attr.operator='==';   
        return attr;    
    }

    

    $scope.applySkuTypeSelection = function(){
        var attrs=[]
        ctrl.skuTypes.forEach(function(skuType){
            if(!ctrl.skuSelection[skuType.skuTypeCode]){
                attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
            }
        });
        ctrl.data.purchaseConds.sources[0].exclusions.attrs=attrs;
        $mdDialog.hide();
    }

    $scope.closeSkuTypeModal = function(){
        $mdDialog.hide();
    }

}
