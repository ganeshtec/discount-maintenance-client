describe('Unit testing adminPromotionForm.directive.spec.js', function() {
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
  beforeEach(inject(function(_$compile_, _$rootScope_, _promotionDataService_, _$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
	promotionDataService = _promotionDataService_;
    $httpBackend = _$httpBackend_;		
     // backend definition common for all tests 
    var authRequestHandler = $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json')
                            .respond(200);
	
  }));


  it('Checks if admin promotion form content renders.', function() {
    // Compile a piece of HTML containing the directive
	$scope.data= [];
	$scope.promoform= [];
    var element = $compile("<admin-promotion-form data='data' promoform='promoform'></admin-promotion-form>")($scope);
    $scope.$digest();
	$isolatedScope = element.isolateScope();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Promotion Name");
  });
  
  it('Checks if admin promotion form is constructed according to input data.', function() {
    // Compile a piece of HTML containing the directive
    $scope.index="0";
    $scope.data={};
    $scope.data.length=10;
    console.log($scope);

    var element = $compile("<admin-promotion-form data='data' index='index'></admin-promotion-form>")($scope);
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Promotion Name");
  }); 

  
   it('Check if choosing Different promo types works', function() {
    // Compile a piece of HTML containing the directive
	$scope.data= [];
	$scope.promoform= [];
    var element = $compile("<admin-promotion-form data='data' promoform='promoform'></admin-promotion-form>")($scope);
    console.log(element); 
    $scope.$digest();
    var isolateScope = element.isolateScope();
    //console.log('_______element Value_IN_PurchaseCondition.directive.spec: ', element);
    console.log(isolateScope);
    //spyOn(isolateScope, "getSelectedSubTypes");
    
    expect(element.html()).toContain("getSelectedSubTypes()");
    
    //TODO use a different selector 
    var promotionDropdown =element.find('.md-select select')[0];
	angular.element(promotionDropdown).val('ORDERPROMO');
	angular.element(promotionDropdown).change()
	 
	//prop('selected', 'selected');
	//fireEvent("onchange");
   // expect($scope.data.reward.method).equal('WHOLEORDER'); 

  }); 
});