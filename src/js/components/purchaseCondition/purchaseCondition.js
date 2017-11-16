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
    this.getRewardLabel = getRewardLabel;
    this.setRewardMethod = setRewardMethod;
    this.isSingleSourcePurchaseCondition = isSingleSourcePurchaseCondition;
    this.isMultiSourcePurchaseCondition = isMultiSourcePurchaseCondition;
    this.isMFAUser;
    this.isDCMUser;
    this.rewardTypeLabel='Percentage';
    

    this.$onInit = $onInit;

    function $onInit() {
        switch (this.data.purchaseConds.channels[0]) {
        case 57:
            this.isDCMUser = true;
            this.thresholdHeaderLabel = 'Minimum purchase type';
            this.thresholdQuantityLabel = 'Quantity purchase';
            this.thresholdAmountLabel = 'Amount spent';
            break
        case 87:
            this.isMFAUser = true;
            this.thresholdHeaderLabel = 'Threshold';
            this.thresholdQuantityLabel = 'Quantity';
            this.thresholdAmountLabel = 'Dollar';
            if(this.data.reward && !this.data.reward.type) {
                this.data.reward.type = 'PERCNTOFF';
            }
            if(!this.data.promoType) {
                this.data.promoType = 'ITEMPROMO';
            }
            this.setRewardMethod();
            break
        }
        this.qualuom = (this.data.reward && this.data.reward.details[0].qualUOM) || 'Quantity';
        this.setQualUOM(this.qualuom);  
              
    }
    function setQualUOM(qualuom) {
        if (this.data.reward.details) {
            for (var i = 0; i < this.data.reward.details.length; i++) {
                this.data.reward.details[i].qualUOM = qualuom;
            }
        }
        this.data.purchaseConds.qualUOM = qualuom;
    }

    function getRewardLabel() {
        var rewardTypeLabel = 'Percentage';
        switch(this.data.reward.type){
        case 'AMTOFF':
            rewardTypeLabel='Amount';
            break;    
        case 'PERCNTOFF':
            rewardTypeLabel='Percentage';
            break;    
        }
        return rewardTypeLabel;
    }

    function setRewardMethod() {
        switch(this.data.promoType){
        case 'ITEMPROMO':
            this.data.reward.method = 'INDVDLAFFECTEDITMS';
            break;    
        case 'ORDERPROMO':
            this.data.reward.method = 'WHOLEORDER';
            break;    
        }
    }

    function isSingleSourcePurchaseCondition() {
        return this.purchaseCondition && this.purchaseCondition.sources && this.purchaseCondition.sources.length == 1;
    }

    function isMultiSourcePurchaseCondition() {
        return this.purchaseCondition && this.purchaseCondition.sources && this.purchaseCondition.sources.length > 1;
    }

    function updatePrintLabel() {
        utilService.updatePrintLabel(this.data);
    }

    function addPurchaseCondition() {
        this.data.reward.details = this.data.reward.details || [];
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
