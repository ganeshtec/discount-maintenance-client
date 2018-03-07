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
    var loginService;

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        controller = $controller('MainCtrl', {$scope: $scope});
    }));

    beforeEach(inject(function (_loginService_) {
      loginService = _loginService_;

      spyOn(loginService, 'getUserName').and.callFake(function () {
          return username;
      })
      spyOn(loginService, 'getCurrentUserRole').and.callFake(function () {
          return currentUserRole;
      })
      spyOn(loginService, 'getUserPermissions').and.callFake(function () {
          return userPermValue;
      })
      spyOn(loginService, 'logout').and.callFake(function () {
      })
    }));

    describe('UserLogin', function () {
        it('test setLogInfo sets the username, currentUserRole and userpermmision', function () {
            $scope.setLoginInfo();
            expect($scope.username).toBe(username);
            expect($scope.userPermissions).not.toBeNull();
            expect($scope.userRoleSelected.id).toBe(currentUserRole);
        });


    });
    describe('Logout', function () {
        it('test logout function clears the username and userpermmision', function () {
            $scope.logout();
            expect(loginService.logout.calls.count()).toBe(1);
        });


    });
});
