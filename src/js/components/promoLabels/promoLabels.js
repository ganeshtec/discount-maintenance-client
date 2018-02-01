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

PromoLabelsController.$inject = ['$scope','validationService', 'utilService', 'featureFlagService'];

function PromoLabelsController($scope,validationService, utilService, featureFlagService) {

    var ctrl = this;
    ctrl.showReceiptText = false;
    
    ctrl.validatePromotion = function() {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    }

    ctrl.isPromotionActive = function(){
        return utilService.isPromotionActive(ctrl.data);
    }

    ctrl.isPrintLabelDisabled = function(){
        return utilService.isPrintLabelDisabled(ctrl.data);
    }


    ctrl.isReceiptTextActive = function() {
        var promise = featureFlagService.getFeatureFlags();
        promise.then(function(res) {
            ctrl.showReceiptText = res.receiptText;
        })
    }

    ctrl.isReceiptTextActive();

}

