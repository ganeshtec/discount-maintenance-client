app.component('skuTypeModal', {
    bindings: {
        data: '='
    },
    templateUrl: 'skuTypeModal.html',
    controller: SkuTypeModalController,
});

function SkuTypeModalController(skuTypesDataService,$mdDialog,$scope) {
    var ctrl=this;

    skuTypesDataService.fetchSkuTypes().then(function(skuTypes){
        ctrl.skuTypes=skuTypes;
    });

    $scope.closeSkuTypeModal = function(){
        $mdDialog.hide();
    }

    $scope.applySkuTypeSelection = function(){
        $mdDialog.hide();
    }

}
