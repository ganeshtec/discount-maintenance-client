describe('Unit testing attributeModal.directive.spec.js', function() {
  var $compile,
      $rootScope,
      $scope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  // it('Checks if modal is rendered.', function() {
  //   $scope.modalData =[
  //   { name:"item1"},
  //    { name:"item2"}
  //   ];
    
  //   $httpBackend.when('GET', 'views/core/main/main.html').respond(fakedMainResponse);
    
  //   console.log($scope);

  //   // Compile a piece of HTML containing the directive
  //   element = $compile("<attribute-modal modal='modalData'></attribute-modal>")($scope);
  //   $scope.$digest();
  //   // Check that the compiled element contains the templated content
  //   expect(element.html()).toContain("#attributeModal");
  // });


});