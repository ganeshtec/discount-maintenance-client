describe('purchaseCondition', function () {

    var $componentController;
    var $compile;
    var $rootScope;
    var $scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function (_$componentController_, _$compile_, _$rootScope_, _$httpBackend_) {
        $componentController = _$componentController_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        _$httpBackend_.when('GET', '/labels/leadTime')
            .respond(200, 3);
    }));   
    describe('dcm user',function(){
        beforeEach(inject(function () {
            ctrl = $componentController('purchaseCondition', null, {
                data: {
                    reward: {
                        details: [{}],
                        type: 'PERCNTOFF'
                    },
                    purchaseConds: {
                        channels: [57],
                        sources: []
                    }
                },
                validationErrors: {
                    minQtyThreshold: {
                        isError: false,
                        message: ''
                    }
                },
            });
        }));

        it('verify Rewards radio button should be invisible for MFA User ', function () {
            $scope.purchaseCondition = {};
            $scope.qualuom = {};
            $scope.promoform = {};
            $scope.preview = false;
            $scope.isDisabled = false;
            var element = $compile("<purchase-condition data='data' promoform='promoform' preview='preview' purchase-condition='data.purchaseConds' is-disabled='isDisabled' ></purchase-condition>")($scope);
            expect(element.find('.md-text-field').is(':visible')).toBe(false);
        });

        it('verify $onInit function', function () {
            var element = $compile("<purchase-condition data='data' promoform='promoform' preview='preview' purchase-condition='data.purchaseConds' is-disabled='isDisabled' ></purchase-condition>")($scope);
            ctrl.$onInit();
            expect(ctrl.isDCMUser).toBeTruthy();
            expect(ctrl.qualuom).toEqual('Quantity');
        });

        it('#setRewardLabel function', function () {
            ctrl.setRewardLabel();
            expect(ctrl.rewardTypeLabel).toEqual('Percentage');
        });

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
            ctrl.data.reward.details = [{ min: 0, value: 12, maxAllowedVal: 2 }, { min: 2, value: 25, maxAllowedVal: 3 }, { min: 0, value: 120, maxAllowedVal: 25 }];
            ctrl.validatePromotion();

            expect(ctrl.validationErrors.minimumThreshold[0].isError).toBe(true);
            expect(ctrl.validationErrors.minimumThreshold[0].message).not.toBe('');
        });

        it('Returns isError as false and empty error message when selected minimum quantity threshold is other than 0', function () {
            ctrl.data.reward.details = [{ min: 0, value: 12, maxAllowedVal: 2 }, { min: 2, value: 25, maxAllowedVal: 3 }, { min: 0, value: 120, maxAllowedVal: 25 }];
            ctrl.validatePromotion();

            expect(ctrl.validationErrors.minimumThreshold[1].isError).toBe(false);
            expect(ctrl.validationErrors.minimumThreshold[1].message).toBe('');
        });
    });

    describe('mfa user',function(){
        beforeEach(inject(function () {
            ctrl = $componentController('purchaseCondition', null, {
                data: {
                    reward: {
                        details: [{}],
                        type: 'PERCNTOFF'
                    },
                    purchaseConds: {
                        channels: [87],
                        sources: []
                    }
                },
                validationErrors: {
                    minQtyThreshold: {
                        isError: false,
                        message: ''
                    }
                },
            });
        }));

        it('verify $onInit function', function () {
            var element = $compile("<purchase-condition data='data' promoform='promoform' preview='preview' purchase-condition='data.purchaseConds' is-disabled='isDisabled' ></purchase-condition>")($scope);
            ctrl.$onInit();
            expect(ctrl.isMFAUser).toBeTruthy();
            expect(ctrl.qualuom).toEqual('Quantity');
            expect(ctrl.data.promoType).toEqual('ITEMPROMO');
            expect(ctrl.data.reward.method).toEqual('INDVDLAFFECTEDITMS');
        });       
        it('#setRewardMethod function item level', function () {
            ctrl.data.promoType = 'ITEMPROMO';
            ctrl.setRewardMethod();
            expect(ctrl.data.reward.method).toEqual('INDVDLAFFECTEDITMS');
        });
        it('#setRewardMethod function order level', function () {
            ctrl.data.promoType = 'ORDERPROMO';
            ctrl.setRewardMethod();
            expect(ctrl.data.reward.method).toEqual('WHOLEORDER');
        });
    });
});