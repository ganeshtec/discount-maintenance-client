fdescribe('promoLabels', function () {

    var $componentController;
    

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
          
    ctrl = $componentController('promoLabels',null, {
        data: {printLabel:true, labelText:""}
        
       
        
         
         });

  }));


    it('to check printLabel checkbox checked by default', function () {

       // ctrl.data.printLabel = true;

      // expect(scope.$ctrl).toBe(ctrl);

        console.log('Controller Value:: ', ctrl.PromoLabelsController);
       // ctrl.PromoLabelsController();
       
        expect(ctrl.data.printLabel).toBe(true);
      //  expect(ctrl.data.printLabel).is('checked').toBeFalse();
        
    });

    it('to check printLabel Text is disabled when checkbox is unchecked', function () {


        expect(ctrl.data.labelText).toBe("");

    });



   
});