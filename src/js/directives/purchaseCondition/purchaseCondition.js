
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
        promotype: '='
    },
    controller: function PurchaseConditionController() {
        
        this.setQualUOM = setQualUOM;
        this.addPurchaseCondition = addPurchaseCondition;
        this.removePurchaseCondition = removePurchaseCondition;
        this.validatePercentage = validatePercentage;
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
            console.log("data object" , this.data);
        }

        function removePurchaseCondition(index) {
            
            this.data.splice(index, 1);
        }

        if (this.data && !this.data.length) {
           
            this.addPurchaseCondition();
        }

        function validatePercentage(dataIndex) {
            
            this.data[dataIndex].value = this.data[dataIndex].value;
            this.roundPercentage(dataIndex);
        }

         function roundPercentage(dataIndex) {
           
            if (this.data[dataIndex].value) {
                this.data[dataIndex].value = parseFloat((Math.round(this.data[dataIndex].value * 100) / 100).toFixed(2));
            }
        }

    }
});


