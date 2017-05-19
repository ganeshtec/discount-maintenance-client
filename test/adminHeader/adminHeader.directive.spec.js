describe('Unit testing adminHeader.directive.spec.js', function() {
  var $compile,
      $rootScope,
      $httpBackend,
      $scope;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_ , _$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;  
    var leadResponse={};
    var leadTimeHandler=$httpBackend.when('GET','/labels/leadTime').respond(200,leadResponse); 
    $scope = $rootScope.$new();

  }));

  it('Checks if content renders.', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<admin-header></admin-header>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Back to Promotions List");
    $httpBackend.flush();
  });

  it('Checks if content is constructed according to input data.', function() {
    // Compile a piece of HTML containing the directive
    $scope.uistate="Edit";
    $scope.promotype={};
    $scope.promotype.promoSubTypeDesc="Promo type";
    

    var element = $compile("<admin-header uistate='uistate' promotype='promotype'></admin-header>")($scope);
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Edit Promotion");
    expect(element.html()).toContain("Promo type");
    $httpBackend.flush();
  }); 

});