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

PurchaseConditionController.$inject = ['validationService', 'utilService'];

function PurchaseConditionController(validationService, utilService) {

    this.setQualUOM = setQualUOM;
    this.addPurchaseCondition = addPurchaseCondition;
    this.removePurchaseCondition = removePurchaseCondition;
    this.validatePromotion = validatePromotion;
    this.roundPercentage = roundPercentage;
    this.updatePrintLabel = updatePrintLabel;
    this.setRewardLabel = setRewardLabel;

    this.isMFAUser;
    this.isDCMUser;
    this.rewardTypeLabel='Percentage';

    this.$OnInit = $OnInit;

    this.$OnInit();

    function $OnInit() {
        this.qualuom = (this.data.reward && this.data.reward.details[0].qualUOM) || 'Quantity';
        if(this.data.reward && this.data.reward.type=='PERCNTOFF') {
            this.rewardTypeLabel='Percentage';
        }
        switch (this.data.purchaseConds.channels[0]) {
        case 57:
            this.isDCMUser = true;
            this.rewardHeaderLabel='Minimum purchase type';
            this.rewardQuantityLabel='Quantity purchase';
            this.rewardAmountLabel='Amount spent';
            break
        case 87:
            this.isMFAUser = true;
            this.rewardHeaderLabel='Discount';
            this.rewardQuantityLabel='Percent Off';
            this.rewardAmountLabel='Amount Off';
            this.setRewardLabel(this.qualuom);
            break
        }
    }

    function setQualUOM(qualuom) {
        var temp = qualuom;
        this.setRewardLabel(qualuom);
        this.data.reward.details[0].qualUOM = temp;
        if (this.data.reward.details) {
            for (var i = 0; i < this.data.reward.details.length; i++) {
                this.data.reward.details[i].qualUOM = qualuom;
            }
        }
        this.data.purchaseConds.qualUOM = temp;
    }

    function setRewardLabel(qualuom) {
        switch(qualuom){
        case 'Amount':
            this.rewardTypeLabel='Amount';
            break;    
        case 'Quantity':
            this.rewardTypeLabel='Percentage';
            break;    
        }
    }

    function updatePrintLabel() {
        utilService.updatePrintLabel(this.data);
    }

    function addPurchaseCondition() {
        this.data.reward.details = this.data.reward.details || [];
        // var condition = new PurchaseConditionController();
        this.data.reward.details.push({});
        this.updatePrintLabel();
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
