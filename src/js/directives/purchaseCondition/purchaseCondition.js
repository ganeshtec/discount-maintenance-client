
app.component('purchaseCondition', {
    templateUrl: 'purchaseCondition.html',
    bindings: {
        data: '=',
        reward: '=',
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
   

    function setQualUOM(qualuom) {
        var temp = qualuom;
        this.data.qualUOM = temp;
        if (this.data) {
            for (var i = 0; i < this.data.length; i++) {
                this.data[i].qualUOM = qualuom;
            }
        }
    }


    function addPurchaseCondition() {
        this.data = this.data || [];
        var condition = new PurchaseConditionController();
        this.data.push(condition);
        this.validatePromotion();

    }

    function validatePromotion() {
        console.log("data", this.data);
        console.log("promoform", this.promoform);

        this.validationErrors = validationService.validatePromotion(this.data);
        console.log("validation error", validationErrors.minQtyThreshold)
    };

    function removePurchaseCondition(index) {

        this.data.splice(index, 1);
    }

    if (this.data && !this.data.length) {

        this.addPurchaseCondition();
    }

    function roundPercentage(dataIndex) {

        if (this.data[dataIndex].value) {
            this.data[dataIndex].value = parseFloat((Math.round(this.data[dataIndex].value * 100) / 100).toFixed(2));
        }
    }

};



