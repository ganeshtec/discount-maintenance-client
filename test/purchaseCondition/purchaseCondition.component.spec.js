describe('purchaseCondition', function () {

    var $componentController;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
    ctrl = $componentController('purchaseCondition',null, {
        data: {
            reward: {
                details: []
            },
            purchaseConds: {
                sources: []
            }
        },
        validationErrors : {
            minQtyThreshold :{ 
                isError: false,
                message: ''
            }
        },
    });
  }));


    it('adding object in purchaseCondition array', function () {

        ctrl.addPurchaseCondition();
        expect(ctrl.data.reward.details.length).toEqual(2);
    });

    it('remove function in purchaseCondition array', function () {
        ctrl.addPurchaseCondition();
        ctrl.removePurchaseCondition(ctrl.data.reward.details.length - 1);
        expect(ctrl.data.reward.details.length).toEqual(1);
    });


    it('rounds percentages to two decimal places', function () {
        ctrl.data.reward.details[0].value = 50.759;
        ctrl.roundPercentage(0);
        expect(ctrl.data.reward.details[0].value).toEqual(50.76);

        ctrl.data.reward.details[0].value = 45.94202;
        ctrl.roundPercentage(0);
        expect(ctrl.data.reward.details[0].value).toEqual(45.94);
    });


    it('Returns isError as true and non empty error message when selected minimum quantity threshold is 0', function () {
        ctrl.data.reward.details = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}];
        ctrl.validatePromotion();
        
        expect(ctrl.validationErrors.minimumThreshold[0].isError).toBe(true);
        expect(ctrl.validationErrors.minimumThreshold[0].message).not.toBe('');
    });

    it('Returns isError as false and empty error message when selected minimum quantity threshold is other than 0', function () {
        ctrl.data.reward.details = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}];
        ctrl.validatePromotion();

        expect(ctrl.validationErrors.minimumThreshold[1].isError).toBe(false);
        expect(ctrl.validationErrors.minimumThreshold[1].message).toBe('');
    });
});