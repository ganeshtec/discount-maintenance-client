describe('Unit testing adminPromotionForm.directive.spec.js', function () {
  var $compile,
    $rootScope,
    $scope,
    element,
    promotionDataService,
    loginService,
    $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  beforeEach(function(){
    module('app', function($provide) {
      $provide.constant('sectionsIndex', {
        DISCOUNT_PROPERTIES:0,
        QUALIFIERS:1,
        LOCATION:2,
        REWARDS:3,
        DESCRIPTIONS:4,
        REDEMPTION_LIMITS:5,
        LABELS:6,
        SCHEDULE:7
      });
      $provide.constant('MaxCouponGenerationLimit', 300000);
    });
  });
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
    $scope.viewProp = {displayOMSIdExclusion: false}
    $scope.data={
      reward:{
        details:[]
      },
      purchaseConds:{
        channels:[87],
        sources:[{
                    'inclusions': {
                        'partnumbers': [
                            '100672563',
                            '100318041',
                            '100318049'
                        ]
                    },
                    'exclusions': {
                        'partnumbers': [
                            '202075159',
                            '202489241'
                        ]
                    },
                    'minPurchaseQty': 41
                }]
      }
    }

    $scope.formHolder={}
    $scope.validationErrors={}
    $httpBackend.when('GET', '/labels/leadTime').respond(200,3);
    $httpBackend.when('GET', '/customersegment/segments').respond(200,[]);
    $httpBackend.when('GET', '/featureFlags').respond(200, {});
    $httpBackend.when('GET', '/ssoConfig.json').respond(200, {});
    $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json').respond(200,[]);
    $httpBackend.when('POST', '/omsInfo/validate.json').respond(200,[]);
    $httpBackend.when('GET', '/skutypes/').respond(200,[]);
    $httpBackend.when('GET', '/merchHierarchy/departments').respond(200,[]);
    $httpBackend.when('POST', '/skuInfo/skus/validate.json').respond(200,[]);
    var element = $compile("<admin-promotion-form data='data' promo-mfa='promoMfa' view-prop='viewProp'  validation-errors='validationErrors' form-holder='formHolder'></admin-promotion-form>")($scope);
    $rootScope.$digest();
    this.$isolateScope = element.isolateScope();

  }));

  it('resetRewardsOnPromoTypeChange should clear MaxAllowedVal if the reward type is AMTOFF',function(){
    this.$isolateScope.data.reward.type='AMTOFF';
    this.$isolateScope.data.reward.details=[{maxAllowedVal: 1000}];
    this.$isolateScope.resetRewardsOnPromoTypeChange();
    expect(this.$isolateScope.data.reward.details[0].maxAllowedVal).toBe(undefined);
  });

  it('resetRewardsOnPromoTypeChange should preserve MaxAllowedVal if the reward type is PERCNTOFF',function(){
    this.$isolateScope.data.reward.type='PERCNTOFF';
    this.$isolateScope.data.reward.details=[{maxAllowedVal: 1000}];
    this.$isolateScope.resetRewardsOnPromoTypeChange();
    expect(this.$isolateScope.data.reward.details[0].maxAllowedVal).toEqual(1000);
  });

  it('#toggleExclusive function', function () {
    expect(this.$isolateScope.data.exclsve).not.toBe(1);
    this.$isolateScope.toggleExclusive();
    expect(this.$isolateScope.data.exclsve).toEqual(1);
    this.$isolateScope.toggleExclusive();
    expect(this.$isolateScope.data.exclsve).toEqual(0);
});



});
