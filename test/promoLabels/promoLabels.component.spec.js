describe('promoLabels', function () {
    var $componentController;
    
    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
          
    ctrl = $componentController('promoLabels',null, {
        data: {printLabel:true, labelText:""} 
         });

  }));

  // These tests don't seem to assert anything within the controller. Commenting out for now.

    // it('to check printLabel checkbox checked by default', function () {
       
    //     expect(ctrl.data.printLabel).toBe(true);        
    // });

    // it('to check printLabel Text is disabled when checkbox is unchecked', function () {

    //     expect(ctrl.data.labelText).toBe("");
    // });

   
});
