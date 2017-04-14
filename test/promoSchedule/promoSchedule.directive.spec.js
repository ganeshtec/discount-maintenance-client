describe('Unit testing  promo schedule directive', function() {
  var $compile,
      $rootScope,
      $scope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  //TODO: rewrite test after the directive code fetches data from back end
  it('Checks if the content  is rendered', function() {
    $scope.data = {};
    // Compile a piece of HTML containing the directive
    element = $compile("<promo-schedule data='data'><promo-schedule>")($scope);
    $scope.$digest();
   // Check that the compiled element contains the templated content
    expect(element.html()).toContain('Start Date');
    expect(element.html()).toContain('End Date');
  });

    //TODO: Check why time component is not considered when forming date obj.
  it('Checks if date is converted to text', function() {
    $scope.data = {};
    $scope.data.startDt = "2016-01-01 00:00:00";
    $scope.data.endDt = "2016-01-10 00:00:00";
    // Compile a piece of HTML containing the directive
    element = $compile("<promo-schedule data='data'><promo-schedule>")($scope);
    $scope.$digest();
    angular.element(element.find('input')[0]).triggerHandler('blur');
    expect($scope.data.startDt).toBe("2016-01-01 00:00:00");
    expect($scope.data.endDt).toBe("2016-01-10 00:00:00");
  });

  it('Sets the earliest start date to today', function() {
    var expectedStartDateLimit = new Date();
    expectedStartDateLimit.setDate(scope.startDateLimit.getDate() - 1);
    expect($scope.startDateLimit).toBe(expectedStartDateLimit);
  });

});