describe('Unit testing adminPromotionForm.directive.spec.js', function () {
  var $compile,
    $rootScope,
    $scope,
    element,
    promotionDataService,
    loginService,
    $httpBackend,
    $componentController;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  beforeEach(function () {
    module('app', function ($provide) {
      $provide.constant('sectionsIndex', {
          DISCOUNT_PROPERTIES:0,
          QUALIFIERS:1,
          REWARDS:2,
          DESCRIPTIONS:3,
          REDEMPTION_LIMITS:4,
          LABELS:5,
          SCHEDULE:6,
          SUMMARY:7
      });
      $provide.constant('MaxCouponGenerationLimit', 300000);
    });
  });
  
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$componentController_,_promotionDataService_, _customerSegmentDataService_, _$httpBackend_, _loginService_) {

    $componentController = _$componentController_;
  
    loginService = loginService;
    promotionDataService = _promotionDataService_;
    customerSegmentDataService = _customerSegmentDataService_;
    $httpBackend = _$httpBackend_;
    var response = {};
   
    $httpBackend.when('GET', '/labels/leadTime').respond(200, 3);
    $httpBackend.when('GET', '/customersegment/segments').respond(200, []);
    $httpBackend.when('GET', '/featureFlags').respond(200, {});
    $httpBackend.when('GET', '/ssoConfig.json').respond(200, {});
    $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json').respond(200, []);
    $httpBackend.when('POST', '/omsInfo/validate.json').respond(200, []);
    $httpBackend.when('GET', '/skutypes/').respond(200, []);
    $httpBackend.when('GET', '/merchHierarchy/departments').respond(200, []);
    $httpBackend.when('POST', '/skuInfo/skus/validate.json').respond(200, []);
    ctrl = $componentController('adminPromotionForm', null, {
      data: {
        reward: {
          details: []
        },
        purchaseConds: {
          channels: [87],
          sources: [{
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
      },
      formHolder:{},
      viewProp: { displayOMSIdExclusion: false }
    }

    );
  }));
  

  it('resetRewardsOnPromoTypeChange should clear MaxAllowedVal if the reward type is AMTOFF', function () {
    ctrl.data.reward.type = 'AMTOFF';
    ctrl.data.reward.details = [{ maxAllowedVal: 1000 }];
    ctrl.resetRewardsOnPromoTypeChange();
    expect(ctrl.data.reward.details[0].maxAllowedVal).toBe(undefined);
  });

  it('resetRewardsOnPromoTypeChange should preserve MaxAllowedVal if the reward type is PERCNTOFF', function () {
    ctrl.data.reward.type = 'PERCNTOFF';
    ctrl.data.reward.details = [{ maxAllowedVal: 1000 }];
    ctrl.resetRewardsOnPromoTypeChange();
    expect(ctrl.data.reward.details[0].maxAllowedVal).toEqual(1000);
  });

  it('#toggleExclusive function', function () {
    expect(ctrl.data.exclsve).not.toBe(1);
    ctrl.toggleExclusive();
    expect(ctrl.data.exclsve).toEqual(1);
    ctrl.toggleExclusive();
    expect(ctrl.data.exclsve).toEqual(0);
  });

  it('#toggleSingleSkuBulk function', function () {
    ctrl.data.singleSkuBulk = 0;
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(1);

    ctrl.data.singleSkuBulk = 1;
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(0);  
  });

  it('#toggleSingleSkuBulk unchecks and disable Exclusive', function () {
    ctrl.data.singleSkuBulk = 0;
    ctrl.data.exclsve = 1
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(1);
    expect(ctrl.data.exclsve).toEqual(0);
  });

  it('#toggleSingleSkuBulk unchecks and disable Rapid Pass', function () {
    ctrl.data.singleSkuBulk = 0;
    ctrl.data.checkRapidPass = true
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(1);
    expect(ctrl.data.checkRapidPass).toEqual(false);
  });

  it('#toggleSingleSkuBulk unchecks and disable Customer Segment', function () {
    ctrl.data.singleSkuBulk = 0;
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(1);
      expect(ctrl.data.segment).toEqual(null);
  });

  it('#toggleSingleSkuBulk checks and disabled Printlabel', function () {
    ctrl.data.singleSkuBulk = 0;
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(1);
    expect(ctrl.data.printLabel).toEqual(true);

    ctrl.data.singleSkuBulk = 1;
    ctrl.toggleSingleSkuBulk();
    expect(ctrl.data.singleSkuBulk).toEqual(0);
    expect(ctrl.data.printLabel).toEqual(false);
  });

});
