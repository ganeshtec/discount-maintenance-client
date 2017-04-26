fdescribe('purchaseCondition', function () {

    var $componentController;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
    ctrl = $componentController('purchaseCondition',null, {
         data: [],
         });

  }));


    it('adding object in purchaseCondition array', function () {

        ctrl.addPurchaseCondition();
        expect(ctrl.data.length).toEqual(2);
    });

    it('remove function in purchaseCondition array', function () {
        ctrl.addPurchaseCondition();
        ctrl.removePurchaseCondition(ctrl.data.length - 1);
        expect(ctrl.data.length).toEqual(1);
    });


    it('rounds percentages to two decimal places', function () {
        ctrl.data[0] = {};

        ctrl.data[0].value = 50.759;
        ctrl.roundPercentage(0);
        expect(ctrl.data[0].value).toEqual(50.76);

        ctrl.data[0].value = 45.94202;
        ctrl.roundPercentage(0);
        expect(ctrl.data[0].value).toEqual(45.94);
    });
});