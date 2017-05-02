
app.component('purchaseCondition', {
    templateUrl: 'purchaseCondition.html',
    bindings: {
        data: '=',
        qualUOM: '=',
        promoform: '=',
        preview: '=',
        isDisabled: '=',
        purchaseCondition: '=',
        promotype: '=',
        validationErrors: '='

    },
    controller: PurchaseConditionController
});

PurchaseConditionController.$inject = ['validationService'];

function PurchaseConditionController(validationService) {

    this.setQualUOM = setQualUOM;
    this.addPurchaseCondition = addPurchaseCondition;
    this.removePurchaseCondition = removePurchaseCondition;
    this.validatePromotion = validatePromotion;
    this.roundPercentage = roundPercentage;
    //var publicApi = {};

    function setQualUOM(qualuom) {
        var temp = qualuom;
        this.data.reward.details[0].qualUOM = temp;
        if (this.data.reward.details) {
            for (var i = 0; i < this.data.reward.details.length; i++) {
                this.data.reward.details[i].qualUOM = qualuom;
            }
        }
    }
     
   
    function addPurchaseCondition() {
        this.data.reward.details = this.data.reward.details || [];
        var condition = new PurchaseConditionController();
        this.data.reward.details.push(condition);
    }

    function validatePromotion() {     
        this.validationErrors = validationService.validatePromotion(this.data);    
    }

    function removePurchaseCondition(index) {
        this.data.reward.details.splice(index, 1);
    }

    if (this.data && !this.data.reward.details.length) {
        this.addPurchaseCondition();
    }

    function roundPercentage(dataIndex) {
        if (this.data.reward.details[dataIndex].value) {
            this.data.reward.details[dataIndex].value = parseFloat((Math.round(this.data.reward.details[dataIndex].value * 100) / 100).toFixed(2));
        }
    }

}



