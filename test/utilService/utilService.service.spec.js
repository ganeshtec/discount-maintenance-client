describe('utilService', function() {
  var $httpBackend,
      $compile,
      $rootScope,
      $scope,
      utilService,
      $httpBackend;

      var Promotion = {
                "endDt":"2017-05-19 14:19:02",
                "printLabel":"true",
                "status":61    
        }

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_utilService_,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    utilService = _utilService_; 
    $httpBackend=_$httpBackend_;
    var leadResponse=3;
    var leadTimeHandler=$httpBackend.when('GET','/labels/leadTime').respond(200,leadResponse);          

    }));
    it('get lead time',function(){
      var leadResponsePromise =utilService.getLeadTime();
      var leadTime=0;
      leadResponsePromise.then(function (value){
        leadTime=value;
      })     
      $httpBackend.flush();
      $scope.$digest();
      expect(leadTime).toBe(3);
    } );
});
