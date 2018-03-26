//TODO remove
describe('Unit testing user input promotion code creation directive', function() {
  var $compile,
      $rootScope,
      $scope,
      $isolatedScope;

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

  it('Checks directive with the appropriate content', function() {
    $scope.data= [1234543545565667];
    // Compile a piece of HTML containing the directive
    var element = $compile("<create-promotion-codes data='data'></create-promotion-codes>")($scope);
    $scope.$digest();
     $isolatedScope = element.isolateScope();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Please enter a valid promotion code equal to or greater than 9 characters");
  });

});
