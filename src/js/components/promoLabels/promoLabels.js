app.component('promoLabels', {
    templateUrl: 'promoLabels.html',
    bindings: {
        data: '=',
        promotype: '=',
        promoform: '=',
        validationErrors: '='
    },
    controller: PromoLabelsController
});

PromoLabelsController.$inject = ['validationService'];

function PromoLabelsController(validationService) {

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);

    }
  

}