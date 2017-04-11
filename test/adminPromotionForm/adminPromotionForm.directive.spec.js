describe('Unit testing adminPromotionForm.directive.spec.js', function () {
  var $compile,
    $rootScope,
    $scope,
    element,
    promotionDataService,
    $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_,_promotionDataService_ ,_customerSegmentDataService_,_$httpBackend_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    customerSegmentDataService = _customerSegmentDataService_;
    $httpBackend = _$httpBackend_;
    var response = {};

    var getPromotionSubTypes = $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json')
                            .respond(200,response);
    var getAllSegments = $httpBackend.when('GET', '/customersegment/segments')
                            .respond(200,response);                    
  }));

  it('Check if getPromotionSubTypes method executes in promotiondataservicespec ', function() {
    var promise = promotionDataService.getPromotionSubTypes();
    $httpBackend.flush();
    $scope.$digest();
  });

   it('Check if getAllSegments method executes in customerSegmentDataService ', function() {
    var promise = customerSegmentDataService.getAllSegments();
    $httpBackend.flush();
    $scope.$digest();
  });

  it('Checks if Promotion Type Exist.', function () {
    var promotionData = [];
    $scope.promoForm = [];
    $scope.formHolder = [];
    $scope.promotionSubTypesForMFA = true;

    // Compile a piece of HTML containing the directive
    element = $compile("<admin-promotion-form data='promotionData' promo-form='promoForm' form-holder='formHolder'> </admin-promotion-form>")($scope);
    $scope.$digest();

    this.$isolatedScope = element.isolateScope();
    var data = 1;
    // Check that the compiled element contains the templated content
   // console.log(view.html());
    expect(element.html()).toContain("Promotion Type");

  });


});