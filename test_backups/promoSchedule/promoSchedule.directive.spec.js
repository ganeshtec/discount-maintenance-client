describe('Unit testing promo Schedule directive', function() {
  var $compile,
      $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$scope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = _$scope_;
  }));

  it('Checks directive with the appropriate content', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<promo-schedule></promo-schedule>")($rootScope);
   
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("startDt, endDt");
    
  });
  
  it('Checks Start time and end time with default value', function() {
    // Compile a piece of HTML containing the directive
   
    // Check that the compiled element contains the templated content
    expect($scope.starttime).toEqual("3:00 AM");
    expect($scope.endtime).toEqual("2:59 AM");
    
  });
});