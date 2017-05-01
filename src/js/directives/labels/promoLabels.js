app.component('promoLabels', {
    templateUrl: 'promoLabels.html',
    bindings: {
        data: '=',
        promotype: '='
        },
    controller: PromoLabelsController
});

//PurchaseConditionController.$inject = ['validationService'];

function PromoLabelsController() {

  //  this.addPurchaseCondition = addPurchaseCondition;
  //  var publicApi = {};

  
     
   
    // function addPurchaseCondition() {
    //     this.data.reward.details = this.data.reward.details || [];
    //     var condition = new PurchaseConditionController();
    //     this.data.reward.details.push(condition);
    // }

   
    // function removePurchaseCondition(index) {
    //     this.data.reward.details.splice(index, 1);
    // }

    // if (this.data && !this.data.reward.details.length) {
    //     this.addPurchaseCondition();
    // }

    

};