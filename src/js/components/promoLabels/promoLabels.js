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

PromoLabelsController.$inject = ['validationService', 'utilService'];

function PromoLabelsController(validationService, utilService) {

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
    }

    this.isPromotionActive = function(){
        return utilService.isPromotionActive(this.data);
    }

}