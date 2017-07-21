describe('Promo schedule', function() {

  var $componentController,
      $filter;
  var ctrl;

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
  it('Test start and end time',function(){
      expect(ctrl.startTime).toBe('3:00 AM');
      expect(ctrl.endTime).toBe('2:59 AM')
  });

});
