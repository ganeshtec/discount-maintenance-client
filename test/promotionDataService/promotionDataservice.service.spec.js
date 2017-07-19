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

    var getPromotionSubTypes = $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json')
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

   it('Check if getPromotionSubTypes method executes in promotiondataservice ', function() {
    var promise = promotionDataService.getPromotionSubTypes();
    $httpBackend.flush();
    $scope.$digest();
  });

  it('Validate getPromotions Method', function(){
      var searchResponse={totalCount:0};   
      var channels=[87];
      var promoname='';
      var page =1;
      var pageSize =10;
      var status ='all';
      var promoTypeCd= 'all';
      var sortby = 'none';
      var order = 'asc';
      $httpBackend.expectPOST('/search',{"criteria":{"channels":[87],"term":"","page":{"page":1,"size":10}}}).respond(200,searchResponse);    
      var promise = promotionDataService.getPromotions(channels, promoname, page, pageSize, status, promoTypeCd, sortby, order);
      promise.then(function(data){
        expect(data.totalCount).toBe(0);
      })
      $scope.$digest();
      $httpBackend.flush();   
  })
 
});