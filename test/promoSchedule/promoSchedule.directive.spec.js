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

  it('converts dates to strings.', function() {
    ctrl.data.startDtFmt = new Date(2017, 8, 10);
    ctrl.data.endDtFmt = new Date(2017, 9, 12);
    ctrl.convertToString();
    var expectedStringStartDate = $filter('date')(ctrl.data.startDtFmt, 'yyyy-MM-dd');
    var expectedStringEndDate = $filter('date')(ctrl.data.endDtFmt, 'yyyy-MM-dd');

    expect(ctrl.data.startDt).toEqual(expectedStringStartDate);
    expect(ctrl.data.endDt).toEqual(expectedStringEndDate);
  });

  it('sets startDtFmt and endDtFmt when editing a discount.', function() {
    ctrl.data.startDt = "2017-03-15";
    ctrl.data.endDt = "2017-04-10";
    var expectedDateTypeStartDate = moment(ctrl.data.startDt).toDate();
    var expectedDateTypeEndDate = moment(ctrl.data.endDt).toDate();

    ctrl.setDatesOnEdit();

    expect(ctrl.data.startDtFmt).toEqual(expectedDateTypeStartDate);
    expect(ctrl.data.endDtFmt).toEqual(expectedDateTypeEndDate);
  })

});
