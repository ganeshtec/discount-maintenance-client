app.component('promoLabels', {
    templateUrl: 'promoLabels.html',
    bindings: {
        data: '=',
        promotype: '=',
        promoform: '=',
        validationErrors: '=',
        preview: '='
    },
    controller: PromoLabelsController
});

PromoLabelsController.$inject = ['$rootScope','validationService', 'utilService'];

function PromoLabelsController($rootScope,validationService, utilService) {

    var ctrl = this;
    ctrl.showReceiptText = $rootScope.receiptText;

    ctrl.validatePromotion = function() {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    };

    ctrl.isPromotionActive = function(){
        return utilService.isPromotionActive(ctrl.data);
    };

    ctrl.isPrintLabelDisabled = function(){
        return utilService.isPrintLabelDisabled(ctrl.data);
    };


    ctrl.isReceiptTextActive = function() {
        ctrl.showReceiptText;
    };

    ctrl.isReceiptTextActive();

}

