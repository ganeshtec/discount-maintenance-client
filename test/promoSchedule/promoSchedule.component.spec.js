describe('Promo schedule', function() {

  var $componentController,
      $filter, $rootScope;
  var ctrl;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  beforeEach(function(){
    module('app', function($provide) {
        $provide.constant('MaxCouponGenerationLimit', 300000);
    });
  });

  beforeEach(inject(function(_$componentController_, _$filter_, _$rootScope_){
    $componentController = _$componentController_;
    $filter = _$filter_;
    $rootScope = _$rootScope_;
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
      ctrl.$onInit();
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
    expect(ctrl.data.minEndDt).toEqual("2017-10-10");
  });

 it('Test setEndDateMin',function(){
    $rootScope.leadTime = 3;
    ctrl = $componentController('promoSchedule',null, {
        data: {
            printLabel: true,
            startDt: '10/10/2017 02:59:00',
            endDt: '12/10/2017 02:59:00'
        },
    });
    ctrl.$onInit();
    expect(ctrl.data.minEndDt).toEqual("2017-10-13");
  });

  it('Test startDateLimit create promo',function(){
    ctrl = $componentController('promoSchedule',null, {
        data: {startDt: '10/10/2017 02:59:00', endDt: '12/10/2017 02:59:00'}
    });
    ctrl.$onInit();
    expect(ctrl.startDateLimit).toEqual(moment().format('YYYY-MM-DD'));
  });

  it('Test startDateLimit edit promo',function(){
    ctrl = $componentController('promoSchedule',null, {
        data: {promoId: 1, startDt: '10/10/2017 02:59:00', endDt: '12/10/2017 02:59:00'}
    });
    ctrl.$onInit();
    expect(ctrl.startDateLimit).toEqual("2017-10-10");
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
