describe('Unit testing redemption limit directive', function() {
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
    var element = $compile("<redemption-limit></redemption-limit>")($rootScope);
   
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("maxUsesPerOrd, maxUsesPerCust,maxUsesOfPromo , Unlimited , Set maximum redemption");
    
  });
  
  it('Checks Start time and end time with default value', function() {
    // Compile a piece of HTML containing the directive
   
    // Check that the compiled element contains the templated content
    expect($scope.maxUsesPerOrd).toEqual("-1");
    expect($scope.maxUsesPerCust).toEqual("-1");
    expect($scope.maxUsesofPromo).toEqual("-1");
    
  });
});