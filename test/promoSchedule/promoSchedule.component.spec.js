describe('Promo schedule', function() {

  var $componentController,
      $filter;
  var ctrl;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  beforeEach(function(){
    module('app', function($provide) {
        $provide.constant('MaxCouponGenerationLimit', 300000);
    });
  });

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

  it('Test init',function(){ 
    ctrl = $componentController('promoSchedule',null, {
        data: {
            startDt: '10/10/2017 02:59:00',
            endDt: '12/10/2017 02:59:00'},
        validationErrors : {
            minQtyThreshold :{ 
                isError: false,
                message: ''
            }
        },
    });
    ctrl.$onInit();
    expect(ctrl.data.startDt).toEqual(moment("10/10/2017").toDate());
    expect(ctrl.data.endDt).toEqual(moment("12/10/2017").toDate());
  });

  it('Test setEndDtFromUI', function(){
    ctrl = $componentController('promoSchedule',null, {
        data: {
            endDtFormatted: '10/10/2017 02:59:00'
        }
    });
    ctrl.setEndDtFromUI();
    expect(ctrl.data.endDt).toEqual('10/10/2017 02:59:00');
  });
  it('Test updateNoEndDate', function(){
    ctrl = $componentController('promoSchedule',null, {
        data: {
            endDateSelection: true
        }
    });
    ctrl.updateNoEndDate();
    expect(ctrl.data.endDt).toEqual(moment("12/31/9999").toDate());
    ctrl.data.endDateSelection = false;
    ctrl.updateNoEndDate();
    expect(ctrl.data.endDt).toEqual(null);
  });
});
