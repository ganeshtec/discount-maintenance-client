describe('Unit testing  redemption-limit directive', function() {
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

  //check if the directive is rendereds
  it('Checks if the content is rendered', function() {
     $scope.data= [];
     $scope.promoform= [];
    // Compile a piece of HTML containing the directive
    element = $compile("<redemption-limit data='data' promoform='promoform'><redemption-limit>")($scope);
    $scope.$digest();
    $isolatedScope = element.isolateScope();

    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Maximum redemption limits for this promotion");
  });




});