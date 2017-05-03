describe('Unit testing promo schedule directive', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      leadTimeService;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _leadTimeService_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    leadTimeService = _leadTimeService_;

    $scope.data = {
    };
    element = $compile("<promo-schedule data='data'><promo-schedule>")($scope);
    $scope.$digest();
    this.$isolateScope = element.isolateScope();
  }));


});
