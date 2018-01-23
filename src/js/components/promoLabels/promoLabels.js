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

PromoLabelsController.$inject = ['validationService', 'utilService', 'featureFlagService'];

function PromoLabelsController(validationService, utilService, featureFlagService) {

    var ctrl = this;
    ctrl.showReceiptText = false;
    
    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
    }

    this.isPromotionActive = function(){
        return utilService.isPromotionActive(this.data);
    }

    this.isPrintLabelDisabled = function(){
        return utilService.isPrintLabelDisabled(this.data);
    }

    this.isPrintLabelChecked = function() {
        return utilService.isPrintLabelChecked(this.data);
    }

    this.isReceiptTextActive = function() {
        var promise = featureFlagService.getFeatureFlags();
        promise.then(function(res) {
            ctrl.showReceiptText = res.receiptText;
        })
    }

    this.isReceiptTextActive();

}

