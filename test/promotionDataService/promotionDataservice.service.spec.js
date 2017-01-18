describe('Unit test for promotionDataService', function() {
  var $compile,
      $rootScope,
      $scope,
      promotionDataService,
      $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_promotionDataService_ ,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    $httpBackend = _$httpBackend_;
    var reponse = {};
	var submitResponse = {};
     // backend definition common for all tests 
    var authRequestHandler = $httpBackend.when('POST', '/cartPromotionsRequest')
                            .respond(200,reponse);
							
							  // backend definition common for all tests 
    var submitAuthRequestHandler = $httpBackend.when('POST', '/cartPromotionsRequest/approve')
                            .respond(200,submitResponse);
    
  }));

  it('Check if saveasdraft method executes in promotiondataservice ', function() {
    var promise = promotionDataService.saveAsDraft();
    $httpBackend.flush();
    $scope.$digest();
  });
  
   it('Check if submit method executes in promotiondataservice ', function() {
    var promise = promotionDataService.submit();
    $httpBackend.flush();
    $scope.$digest();
  });
 
});