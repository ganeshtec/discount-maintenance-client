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
  beforeEach(inject(function (_$compile_, _$rootScope_,_promotionDataService_ ,_customerSegmentDataService_,_$httpBackend_, _loginService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    loginService = loginService;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    customerSegmentDataService = _customerSegmentDataService_;
    $httpBackend = _$httpBackend_;
    var response = {};
    $scope.promoMfa=true;
    $scope.data={
      reward:{
        details:[]
      },
      purchaseConds:{
        channels:[87]
      }
    }
    spyOn(loginService, 'intercept').and.callFake(function () {
    })

    $scope.formHolder={}
    var leadTime = $httpBackend.when('GET', '/labels/leadTime')
                            .respond(200,3);
    var customerSegments = $httpBackend.when('GET', '/customersegment/segments')
                            .respond(200,[]);
    var promoSubTypes = $httpBackend.when('GET', 'promotionTypes/promotionSubTypes/adminUI.json')
                            .respond(200,[]);
    var element = $compile("<admin-promotion-form data='data' promo-mfa='promoMfa' form-holder='formHolder'></admin-promotion-form>")($scope);
    $rootScope.$digest();
    this.$isolateScope = element.isolateScope();

  }));

  // it('resetRewardsOnPromoTypeChange should clear MaxAllowedVal if the reward type is AMTOFF',function(){
  //   this.$isolateScope.data.reward.type='AMTOFF';
  //   this.$isolateScope.data.reward.details=[{maxAllowedVal: 1000}];
  //   this.$isolateScope.resetRewardsOnPromoTypeChange();
  //   expect(this.$isolateScope.data.reward.details[0].maxAllowedVal).toBe(undefined);

  // });

  // it('resetRewardsOnPromoTypeChange should preserve MaxAllowedVal if the reward type is PERCNTOFF',function(){
  //   this.$isolateScope.data.reward.type='PERCNTOFF';
  //   this.$isolateScope.data.reward.details=[{maxAllowedVal: 1000}];
  //   this.$isolateScope.resetRewardsOnPromoTypeChange();
  //   expect(this.$isolateScope.data.reward.details[0].maxAllowedVal).toEqual(1000);
  // });

});
