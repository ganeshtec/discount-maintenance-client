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
                displayOMSId: false,
                displayMFGBrand: false,
                displayWebHierarchy: false,
                displayOMSIdExclusion: false,
                displayExclusionSubCategories: false,
                displayPaymentType: false,
                displayScheduleTime: true,
                displayLocations: true,
                displayPrintLabel: false,
                displayItemsSku:true,
                displayMerchHiearchy: true,
                displayCustomerSegment: true,
                promotionSubTypesForMFA: true,
                displayFilterSkuTypes: true
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
                displayOMSId: true,
                displayMFGBrand: true,
                displayWebHierarchy: true,
                displayOMSIdExclusion: true,
                displayExclusionSubCategories: true,
                displayPaymentType: true,
                displayScheduleTime: true,
                displayLocations: false,
                displayPrintLabel: false,
                displayItemsSku:false,
                displayMerchHiearchy: false,
                displayCustomerSegment: false,
                promotionSubTypesForMFA: false,
                displayFilterSkuTypes: false
            }
            controller.setViewProperties(allowedPermissionIds.ONLINE);
            expect($scope.viewProperties).toEqual(expectedResult);
        });
    });

        describe('Test view properties', function() {
        it('Sets appropriate view properties for MFA/Store users', function() {
            var expectedResult = {
                displayPromoDescription: false,
                displayRedemptionLimits: false,
                displayRedemptionMethod: false,
                displayCombinationPromo: false,
                displayOMSId: false,
                displayMFGBrand: false,
                displayWebHierarchy: false,
                displayOMSIdExclusion: false,
                displayExclusionSubCategories: false,
                displayPaymentType: false,
                displayScheduleTime: true,
                displayLocations: true,
                displayPrintLabel: false,
                displayItemsSku:true,
                displayMerchHiearchy: true,
                displayCustomerSegment: true,
                promotionSubTypesForMFA: true,
                displayFilterSkuTypes: true
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
                displayOMSId: true,
                displayMFGBrand: true,
                displayWebHierarchy: true,
                displayOMSIdExclusion: true,
                displayExclusionSubCategories: true,
                displayPaymentType: true,
                displayScheduleTime: true,
                displayLocations: false,
                displayPrintLabel: false,
                displayItemsSku:false,
                displayMerchHiearchy: false,
                displayCustomerSegment: false,
                promotionSubTypesForMFA: false,
                displayFilterSkuTypes: false
            }
            controller.setViewProperties(allowedPermissionIds.ONLINE);
            expect($scope.viewProperties).toEqual(expectedResult);
        });
    });

    describe('updateSections', function() {
        it('Display label section with toggle true and current user MFA', function() {
            $scope.userType = 228;
            controller.setViewProperties(228);
            controller.updateSections(true);
            expect($scope.sections[6].shouldDisplay).toEqual(true);
            expect($scope.viewProperties.displayPrintLabel).toEqual(true);
        });

        it('Should not display label section with toggle true and current user DCM', function() {
            $scope.userType = 229;
            controller.setViewProperties(229);
            controller.updateSections(true);
            expect($scope.sections[6].shouldDisplay).toEqual(false);
        });
    });
    
});