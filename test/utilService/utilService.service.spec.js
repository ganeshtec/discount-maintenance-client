describe('utilService', function() {
  var $compile,
      $rootScope,
      $scope,
      utilService,
      $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_utilService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    utilService = _utilService_;             

    }));
    
    it('determines if a promotion is active', function() {
        var activePromo = {}
        activePromo.startDt = "2017-04-18 00:00:00";
        expect(utilService.isPromotionActive(activePromo)).toBe(true);

        var inactivePromo = {}
        inactivePromo.startDt = "";
        expect(utilService.isPromotionActive(inactivePromo)).toBe(false);
    });

});
