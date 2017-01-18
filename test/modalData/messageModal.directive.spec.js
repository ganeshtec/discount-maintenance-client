describe('Unit testing message modal directive', function() {
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

  it('Checks if  message model isrendered', function() {
    $scope.modalData  =   { 
      title:"Title",
      message:"Message"
    }
    // Compile a piece of HTML containing the directive
    element = $compile("<message-modal modal='modalData'></message-modal>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Title");
    expect(element.html()).toContain("Message");
  });


});