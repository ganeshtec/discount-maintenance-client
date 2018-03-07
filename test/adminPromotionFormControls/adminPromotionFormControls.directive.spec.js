describe('Unit testing adminPromotionFormControl.directive.spec.js', function() {
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

  it('Checks if nav is rendered.', function() {
    $scope.formData =[
     { index:"0"},
     { index:"1"}
    ];
    // Compile a piece of HTML containing the directive
    element = $compile("<admin-promotion-form-controls data='formData'></admin-subnav>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("0");
    expect(element.html()).toContain("1");
  });


});
