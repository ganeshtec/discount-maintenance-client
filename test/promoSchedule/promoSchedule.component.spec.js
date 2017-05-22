describe('Promo schedule', function() {

  var $componentController,
      $filter;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  beforeEach(inject(function(_$componentController_, _$filter_){
    $componentController = _$componentController_;
    $filter = _$filter_;
    ctrl = $componentController('promoSchedule',null, {
        data: {},
        validationErrors : {
            minQtyThreshold :{ 
                isError: false,
                message: ''
            }
        },
    });

  }));

});
