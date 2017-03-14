describe('Unit test for dataService', function() {
  var $compile,
      $rootScope,
      $scope,
      dataService,
      promotionDataService,
      $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_dataService_ ,_promotionDataService_,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    dataService = _dataService_;
    promotionDataService = _promotionDataService_;
    $httpBackend = _$httpBackend_;
    var reponse = {};
     // backend definition common for all tests 
    var authRequestHandler = $httpBackend.when('POST', '/couponRequest/preview')
                            .respond(200,reponse);
    
  }));

  it('Check if data service is created by checking if PromotionDataService using DataService inturn returns a POST response', function() {
   
    var promise = promotionDataService.getSystemGenrateCodes();
    $httpBackend.flush();
    $scope.$digest();
  });
});