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
