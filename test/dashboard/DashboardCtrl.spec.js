describe('DashboardCtrl', function () {
    beforeEach(module('app'));

    var $controller;
    var $scope = {};
    var controller;

    beforeEach(inject(function($injector, _$rootScope_, _$controller_){
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        controller = $controller('DashboardCtrl', { $scope: $scope});
    }));

    describe('Deactivate', function() {
        it('determines if the promotion is within lead time', function() {
            expect($scope.isInLeadTime(new Date(), 5)).toEqual(true);

            var futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);

            expect($scope.isInLeadTime(futureDate, 5)).toEqual(false);

        });

        it('Determines if lead time must be accounted for in this promo', function() {
            expect($scope.eligibleLabelForDeactivate(false, 42, true)).toEqual(false);
            expect($scope.eligibleLabelForDeactivate(true, 61, false)).toEqual(true);
            expect($scope.eligibleLabelForDeactivate(true, 61, true)).toEqual(false);
        });

        it('Determines no action can be taken on MSB with label if within lead time', function() {
            expect($scope.cannotBeDeactivated(true, 61, true)).toEqual(true);
            expect($scope.cannotBeDeactivated(true, 61, false)).toEqual(false);
            expect($scope.cannotBeDeactivated(true, 52, true)).toEqual(false);
        });
    });
});