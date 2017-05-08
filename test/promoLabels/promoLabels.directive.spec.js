describe('promoLabels', function () {

    var $componentController;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_ ) {
    $componentController = _$componentController_;
    ctrl = $componentController('promoLabels',null, {
        data: {printLabel:true}
        
       
        
         
         });

  }));


    it('to check printLabel checkbox checked by default', function () {

       // ctrl.data.printLabel = true;
       
        expect(ctrl.data.printLabel).toBe(true);
    });

   
});