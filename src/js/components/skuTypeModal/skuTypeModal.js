app.component('skuTypeModal', {
    bindings: {
        data: '=',
        skuTypes: '@'
    },
    templateUrl: 'skuTypeModal.html',
    controller: SkuTypeModalController,
});

function SkuTypeModalController(skuTypesService) {
    var ctrl=this;
    skuTypesService.fetchSkuTypes().then(function(skuTypes){
        ctrl.skuTypes=skuTypes;
    });

}
