app.component('skuTypeModal', {
    bindings: {
        source: '=',
        promoStatus: '=',
    },
    scope: {},
    templateUrl: 'skuTypeModal.html',
    controller: SkuTypeModalController,
});

function SkuTypeModalController(skuTypesDataService,$mdDialog) {
    var ctrl=this;
    ctrl.isSkuTypeExcluded =function(skuTypeCode){
        
        var result=false;
        ctrl.source.exclusions.attrs.forEach(function(attr){          
            if(attr.value == skuTypeCode){
                result= true;
            }
        })
        return result;
    }
    ctrl.isSkuTypeExclusionsNotInitialized = function(){
        var result = false;
        if(ctrl.promoStatus == '20' && !ctrl.source.exclusions.skuTypeAttrsInitialized){
            result=true;
        }
        return result;
    }
    ctrl.initializeSkuTypeExclusions = function(){
        var attrs=[];
        ctrl.skuTypes.forEach(function(skuType){
            attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
        });
        ctrl.source.exclusions.attrs=attrs;
        ctrl.source.exclusions.skuTypeAttrsInitialized=true;
    }

    ctrl.$onInit = function () {
        if(ctrl.source.exclusions == undefined){
            ctrl.source.exclusions={};           
        }
        if(ctrl.source.exclusions.attrs == undefined){
            ctrl.source.exclusions.attrs=[];
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
        attr.id='bcdfe1a4-626a-4042-9a2e-5298f9b952a8'
        attr.name='SKU Type';
        attr.operator='==';   
        return attr;    
    }

    

    ctrl.applySkuTypeSelection = function(){
        var attrs=[]
        ctrl.skuTypes.forEach(function(skuType){
            if(!ctrl.skuSelection[skuType.skuTypeCode]){
                attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
            }
        });
        ctrl.source.exclusions.attrs=attrs;
        $mdDialog.hide();
    }

    ctrl.closeSkuTypeModal = function(){
        $mdDialog.hide();
    }

}
