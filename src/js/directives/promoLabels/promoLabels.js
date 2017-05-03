app.component('promoLabels', {
    templateUrl: 'promoLabels.html',
    bindings: {
        data: '=',
        promotype: '=',
        promoform: '='
    },
    controller: PromoLabelsController
});

//PromoLabelsController.$inject = ['validationService'];

function PromoLabelsController() {

  //  this.addPurchaseCondition = addPurchaseCondition;
  //  var publicApi = {};
    this.data.printLabel = true;

    

}