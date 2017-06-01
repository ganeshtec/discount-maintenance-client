app.component('promoSkuTypeModal', {
    bindings: {
        data: '=',
    },
    templateUrl: 'promoSkuTypeModal.html',
    controller: PromoSkuTypeModalController,
});

function PromoSkuTypeModalController(skuTypesDataService,$mdDialog) {
    var ctrl=this;
    ctrl.$onInit = function () {
        skuTypesDataService.fetchSkuTypes().then(function(skuTypes){
            ctrl.skuTypes=skuTypes;
            var ctr=0;
             var skuMap  = ctrl.data.skuCountList; 
        ctrl.skuSelection={};  
         for (var i = 0, len = ctrl.skuTypes.length; i < len; i++) {
             for(var j=0; j<skuMap.length;j++) {
                 if(skuMap[j].skuTypeCode==skuTypes[i].skuTypeCode) {
                     ctr++;
                     skuTypes[i].skuCount = skuMap[j].skuCount;
                 }
                              
             }
             if(ctr==0) {
                  skuTypes[i].skuCount  = 0;
             }
             ctr=0;
              ctrl.skuSelection[skuTypes[i].skuTypeCode] =  skuTypes[i].skuTypeCode;
        }
        console.log("__Before calling Sort::",skuTypes);
         ctrl.sortByCount(skuTypes);
       
        });
    }

    ctrl.sortByCount = function(skuTypes) {
        console.log("___Sorting is in Progress___"+skuTypes);

        var sortedArray = [];
        
        


    }
    ctrl.applySkuTypeSelection = function(){
        // var attrs=[]
        // ctrl.skuTypes.forEach(function(skuType){
        //     if(!ctrl.skuSelection[skuType.skuTypeCode]){
        //         attrs.push(ctrl.buildSkuTypeAttr(skuType.skuTypeCode));
        //    }
        // });
        // ctrl.data.purchaseConds.sources[0].exclusions.attrs=attrs;
        // $mdDialog.hide();
    }

    ctrl.closeSkuTypeModal = function(){
        $mdDialog.hide();
    }

}