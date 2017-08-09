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
  it('Test convertDateStringToDate',function(){      
      expect(ctrl.convertDateStringToDate('12/10/2017 02:59:00')).toEqual(moment("12/10/2017").toDate());
      expect(ctrl.convertDateStringToDate('12/10/2017')).toEqual(moment("12/10/2017").toDate());
      expect(ctrl.convertDateStringToDate(undefined)).toBe(undefined);
  })
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
  })
});
