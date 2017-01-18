describe('Unit testing adminSubnav.directive.spec.js', function() {
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
    $scope.navData =[
    { name:"item1"},
     { name:"item2"}
    ];
    
    // console.log($scope);

    // Compile a piece of HTML containing the directive
    element = $compile("<admin-subnav data='navData'></admin-subnav>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("item1");
    expect(element.html()).toContain("item2");
  });


});