describe('MainCtrl', function () {
    beforeEach(module('app'));

    var username = 'MFA';
    var userPermValue = [{id: '228', description: 'SKU: Discount Engine-Store MFA', shortDesc: 'Store MFA'}, {
        id: '229',
        description: 'SKU: Discount Engine-Online DCM',
        shortDesc: 'Online DCM'
    }];

    var currentUserRole = '228';

    var $controller;
    var $scope = {};
    var controller;

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        controller = $controller('MainCtrl', {$scope: $scope});
    }));

    beforeEach(inject(function ($cookies) {
        $cookies.put('userName', username);
        $cookies.put('userPermissions', JSON.stringify(userPermValue));
        $cookies.put('currentUserRole', currentUserRole);
    }));

    describe('UserLogin', function () {
        it('test logout function clears the username and userpermmision', function () {
            $scope.setLoginInfo();
            expect($scope.username).toBe(username);
            expect($scope.userPermissions).not.toBeNull();
            expect($scope.userRoleSelected.id).toBe(currentUserRole);

            $scope.logout();
            expect($scope.username).toBe('');
            expect($scope.userPermissions).toBe('');
            expect($scope.userRoleSelected.id).toBe(null)

        });
    });
});
