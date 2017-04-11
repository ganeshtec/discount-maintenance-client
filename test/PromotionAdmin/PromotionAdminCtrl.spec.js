describe('promotionAdminCtrl', function () {
    beforeEach(module('app'));

    var $controller;
    var $scope = {};
    var controller;

    beforeEach(inject(function($injector, _$rootScope_, _$controller_){
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        allowedPermissionIds = $injector.get('ALLOWED_PERMISSION_IDS')();
        controller = $controller('promotionAdminCtrl', { $scope: $scope});
    }));

    describe('Test view properties', function() {
        it('Sets appropriate view properties for MFA/Store users', function() {
            var expectedResult = {
                displayPromoDescription: false,
                displayRedemptionLimits: false,
                displayRedemptionMethod: false,
                displayCombinationPromo: false,
                displayPriority: false,
                displayOMSId: false,
                displayMFGBrand: false,
                displayWebHierarchy: false,
                displayOMSIdExclusion: false,
                displayExclusionSubCategories: false,
                displayPaymentType: false,
                displayScheduleTime: false
            }
            controller.setViewProperties(allowedPermissionIds.STORE);
            expect($scope.viewProperties).toEqual(expectedResult);
        });

        it('Sets appropriate view properties for DCM/Online users', function() {
            var expectedResult = {
                displayPromoDescription: true,
                displayRedemptionLimits: true,
                displayRedemptionMethod: true,
                displayCombinationPromo: true,
                displayPriority: true,
                displayOMSId: true,
                displayMFGBrand: true,
                displayWebHierarchy: true,
                displayOMSIdExclusion: true,
                displayExclusionSubCategories: true,
                displayPaymentType: true,
                displayScheduleTime: true
            }
            controller.setViewProperties(allowedPermissionIds.ONLINE);
            expect($scope.viewProperties).toEqual(expectedResult);
        });
    });
});