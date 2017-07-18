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
  beforeEach(inject(function (_$compile_, _$rootScope_,_promotionDataService_ ,_customerSegmentDataService_,_$httpBackend_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    customerSegmentDataService = _customerSegmentDataService_;
    $httpBackend = _$httpBackend_;
    var response = {};
    $scope.promoMfa=true;
    $scope.data={
      reward:{
        details:[]
      }
    }
    $scope.formHolder={}
    var leadTime = $httpBackend.when('GET', '/labels/leadTime')
                            .respond(200,3); 
    var customerSegments = $httpBackend.when('GET', '/customersegment/segments')
                            .respond(200,[]);    
    var element = $compile("<admin-promotion-form data='data' promo-mfa='promoMfa' form-holder='formHolder'></admin-promotion-form>")($scope);
    $rootScope.$digest();
    this.$isolateScope = element.isolateScope();   

  }));
  it('updatePrintLabelFlag should set printLabel to false if promoMfa is true and promoSubTypeCd is OrderLevelPercentDiscount',function(){ 
      this.$isolateScope.promoSubTypeObject ={promoSubTypeCd:'OrderLevelPercentDiscount'}
      this.$isolateScope.promoMfa=true;
      this.$isolateScope.data.printLabel=true; 
      this.$isolateScope.updatePrintLabelFlag();
      expect(this.$isolateScope.data.printLabel).toBe(false);
  });

  it('updatePrintLabelFlag should set printLabel to true if promoMfa is true and promoSubTypeCd is not OrderLevelPercentDiscount',function(){ 
      this.$isolateScope.promoMfa=true;
      this.$isolateScope.data.printLabel=false; 
      this.$isolateScope.promoSubTypeObject ={promoSubTypeCd:'ProductLevelPerItemPercentDiscountMSB'}
      this.$isolateScope.updatePrintLabelFlag();
      expect(this.$isolateScope.data.printLabel).toBe(true);
  });
  it('updatePrintLabelFlag should not change printLabel flag if promoMfa is false',function(){ 
      this.$isolateScope.data.promoSubTypeCd='Any';
      this.$isolateScope.promoMfa=false;
      this.$isolateScope.data.printLabel=false;
      this.$isolateScope.updatePrintLabelFlag();
      expect(this.$isolateScope.data.printLabel).toBe(false);
      this.$isolateScope.data.printLabel=true;
      this.$isolateScope.updatePrintLabelFlag();
      expect(this.$isolateScope.data.printLabel).toBe(true);
  });

});