app.component('promoLabels', {
    templateUrl: 'promoLabels.html',
    bindings: {
        data: '=',
        promotype: '=',
        promoform: '='
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

   
   
    if (this.data && !this.data.labels) {
    this.data.labels = this.data.labels;
    }

    

};