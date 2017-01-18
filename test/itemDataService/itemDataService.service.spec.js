describe('Unit test for itemsDataService', function() {
  var $compile,
      $rootScope,
      $scope,
      itemsDataService,
      $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_itemsDataService_ ,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    itemsDataService = _itemsDataService_;
    $httpBackend = _$httpBackend_;
    var reponse = {};
     // backend definition common for all tests 
    var authRequestHandler = $httpBackend.when('POST', '/omsInfo/validate.json')
                            .respond(200,reponse);
    
  }));

  it('Check itemDataService executes without js error', function() {
    var promise = itemsDataService.getOmsIdCodes();
    $httpBackend.flush();
    $scope.$digest();
  });
});