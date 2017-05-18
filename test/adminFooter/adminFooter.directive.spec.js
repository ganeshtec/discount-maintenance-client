describe('Unit testing adminFooter.directive.spec.js', function() {
  var $httpBackend,
      $compile,
      $rootScope,
      $scope,
      element,
      utilService;
      var app = module('app');
  // Load the myApp module, which contains the directive
  beforeEach(app);
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_ ,_promotionDataService_,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    $httpBackend = _$httpBackend_;  
    var leadResponse={};
    var leadTimeHandler=$httpBackend.when('GET','/labels/leadTime').respond(200,leadResponse); 
  }));

  it('Checks if content renders.', function() {
      $scope.promotionData = { reward:{details :[]}} 
    // Compile a piece of HTML containing the directive
    var element = $compile("<admin-footer data='promotionData'></admin-footer>")($scope);
    $scope.$digest();
    // Check that the compilesd element contains the templated content
    expect(element.html()).toContain("Preview");
    expect(element.html()).toContain("Save as Draft");
  });

  it('Checks if click actions are handled.', function() {
    $scope.promotionData = { reward:{details :[]}}
    // Compile a piece of HTML containing the directive
    element = $compile("<admin-footer data='promotionData'></admin-footer>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Save as Draft");
    expect(element.html()).toContain("Submit");
  });

  it('Checks if content is constructed according to input data.', function() {
      $scope.promotionData = { reward:{details :[]}}
      var data = $scope.promotionData;
     // Compile a piece of HTML containing the directive
    element = $compile("<admin-footer data='promotionData'></admin-footer>")($scope);
    $scope.$digest();   
    var isolateScope = element.controller("adminFooter");
    expect(element.html()).toContain("Save as Draft");
  }); 

});