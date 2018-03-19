describe('promoLabels', function () {
    var $componentController;
    var $compile;
    var $rootScope;
    var $scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));
    beforeEach(function(){
        module('app', function($provide) {
            $provide.constant('MaxCouponGenerationLimit', 300000);
        });
    });
    beforeEach(inject(function (_$componentController_, _$compile_, _$rootScope_) {
        $componentController = _$componentController_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        ctrl = $componentController('promoLabels', null, {
            data: { printLabel: true, labelText: '', receiptHeader: '', receiptDesc: '' }
        });

    }));

    // These tests don't seem to assert anything within the controller. Commenting out for now.

    // it('to check printLabel checkbox checked by default', function () {

    //     expect(ctrl.data.printLabel).toBe(true);
    // });

    // it('to check printLabel Text is disabled when checkbox is unchecked', function () {

    //     expect(ctrl.data.labelText).toBe("");
    // });

    it('verify receipt header and description field length', function () {
        $scope.promoform = {};
        $scope.preview = false;
        var element = $compile("<promo-labels data ='data' preview='preview' promoform='promoForm' ></promo-labels>")($scope);

        // console.log('Receipt Length: '+ ctrl.data.receiptHeader);
        expect(ctrl.data.receiptHeader.length).toBeLessThan(30);
        expect(ctrl.data.receiptDesc.length).toBeLessThan(30);
    });

    it('verify print labels section fields invisible for DCM User ', function () {
        $scope.promoform = {};
        $scope.preview = false;
        var element = $compile("<promo-labels data ='data' preview='preview' promoform='promoForm' ></promo-labels>")($scope);
        expect(element.find('.md-text-field').is(':visible')).toBe(false);
    });


});
