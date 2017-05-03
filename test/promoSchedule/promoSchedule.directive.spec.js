fdescribe('Promo schedule', function() {

  var $componentController;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  beforeEach(inject(function(_$componentController_){
    $componentController = _$componentController_;

    ctrl = $componentController('promoSchedule',null, {
        data: {
          startDt: ,
          endDt: 
            // reward: {
            //     details: []
            // }
        }
        // validationErrors : {
        //     minQtyThreshold :{ 
        //         isError: false,
        //         message: ''
        //     }
        // },
    });


  }));

  it('converts dates to strings.', function() {
    
  });


});
