describe('Promo schedule', function() {

  var $componentController,
      $filter;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  beforeEach(inject(function(_$componentController_, _$filter_){
    $componentController = _$componentController_;
    $filter = _$filter_;
    ctrl = $componentController('promoSchedule',null, {
        data: {
          startDtFmt: new Date(),
          endDtFmt: new Date()
        },
        validationErrors : {
            minQtyThreshold :{ 
                isError: false,
                message: ''
            }
        },
    });

  }));

  it('converts dates to strings.', function() {
    ctrl.data.startDtFmt = new Date(2017, 8, 10);
    ctrl.data.endDtFmt = new Date(2017, 9, 12);
    ctrl.convertToString();
    var expectedStringStartDate = $filter('date')(ctrl.data.startDtFmt, 'yyyy-MM-dd');
    var expectedStringEndDate = $filter('date')(ctrl.data.endDtFmt, 'yyyy-MM-dd');

    expect(ctrl.data.startDt).toEqual(expectedStringStartDate);
    expect(ctrl.data.endDt).toEqual(expectedStringEndDate);
  });

});
