
describe('LoginServiceTests',function(){
  var $httpBackend;
  var $rootScope;
  var configService;
  var loginService;
  var $location;
  var $window;
  var modalService;

  beforeEach(function () {
     module(function($provide) {
         $provide.value('$window', {
             location: {href: ''}
         });
     });
     module('app');
 });

  beforeEach(inject(function (_loginService_, _$location_, _configService_, _$httpBackend_, _$rootScope_, _$window_, _modalService_) {
    configService = _configService_;
    $httpBackend=_$httpBackend_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    loginService = _loginService_;
    $window= _$window_;
    modalService=_modalService_;
  }));

  it('LoginService.intercept should redirect to login page if user is not logged in',function(){
    spyOn(loginService,'intercept').and.callThrough();
    spyOn(loginService,'redirectToLoginPage');
    $rootScope.$apply();
    expect(loginService.redirectToLoginPage).toHaveBeenCalled();
  });

  it('LoginService.intercept should redirect to login page if token is expired', function(){
    spyOn(loginService,'intercept').and.callThrough();
    spyOn(loginService,'redirectToLoginPage');
    $location.path('/#token_type=bearer&access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleS0xIiwidHlwIjoiSldUIn0.eyJ1c2VyX25hbWUiOiJNRkEwMTAxIiwiZXhwIjowfQ==');
    var userRoles= [{id: 228,description: "SKU: Discount Engine-Store MFA"}];
    $httpBackend.whenGET('undefinedMFA0101.json').respond(userRoles);
    $rootScope.$apply();
    $location.path('/');
    $rootScope.$apply();
    expect(loginService.redirectToLoginPage).toHaveBeenCalled();
  });

  it('LoginService.intercept should not redirect to login page if user is identified and accessToken is not expired', function(){
    spyOn(loginService,'intercept').and.callThrough();
    spyOn(loginService,'redirectToLoginPage');
    $location.path('/#token_type=bearer&access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleS0xIiwidHlwIjoiSldUIn0.eyJ1c2VyX25hbWUiOiJNRkEwMTAxIiwiZXhwIjoyNTM0MDIyNjI2NTR9');
    var userRoles= [{id: 228,description: "SKU: Discount Engine-Store MFA"}];
    $httpBackend.whenGET('undefinedMFA0101.json').respond(userRoles);
    $rootScope.$apply();
    $location.path('/');
    $rootScope.$apply();
    expect(loginService.redirectToLoginPage).not.toHaveBeenCalled();
  });

  it('LoginService.intercept should save user details if access_token parameter is available in url', function(){
    spyOn(loginService,'intercept').and.callThrough();
    spyOn(loginService,'redirectToLoginPage');
    spyOn(modalService,'showAlert');
    $location.path('/#token_type=bearer&access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleS0xIiwidHlwIjoiSldUIn0.eyJ1c2VyX25hbWUiOiJNRkEwMTAxIiwiZXhwIjoyNTM0MDIyNjI2NTR9');
    var userRoles= [{id: "228",description: 'SKU: Discount Engine-Store MFA'}];
    $httpBackend.whenGET('undefinedMFA0101.json').respond(userRoles);
    $rootScope.$apply();
    expect(loginService.getUserInfo().accessTokenDetails.user_name).toEqual('MFA0101');
    expect(loginService.getUserName()).toEqual('MFA0101');
    expect(loginService.getUserInfo().accessTokenDetails.exp).toEqual(253402262654);
    expect(loginService.redirectToLoginPage).not.toHaveBeenCalled();
    // $httpBackend.flush();
    // expect(loginService.getUserPermissions()).toEqual({id: "228",description: 'SKU: Discount Engine-Store MFA'});
    // expect(loginService.getCurrentUserRole()).toEqual('228');
  });

  it('LoginService.logout should redirect user to logout page',function(){
    spyOn(loginService,'logout').and.callThrough();
    spyOn(configService,'getConfig').and.callFake(function(){
      var mockPromise={};
      mockPromise.then = function(callback){
        callback({appId:'123456789', oAuthLogoutUrl: 'http://sso.homedepot.com/logout.do'});
      }
      return mockPromise;
    });
    loginService.logout();
    expect($window.location.href).toEqual('http://sso.homedepot.com/logout.do?client_id=123456789');
  })

  it('LoginService.setCurrentUserRole should always set as number', function(){
    var stringUserRole = '228';
    loginService.setCurrentUserRole(stringUserRole);
    expect(loginService.getCurrentUserRole()).toEqual(228);
    var numberUserRole = '228';
    loginService.setCurrentUserRole(numberUserRole);
    expect(loginService.getCurrentUserRole()).toEqual(228);
  })
});
