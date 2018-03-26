describe('Unit test for PromotionsData factory', function() {
  var PromotionData;
  var allowedPermissionIds;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_PromotionData_,_ALLOWED_PERMISSION_IDS_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    PromotionData = _PromotionData_;
    allowedPermissionIds = _ALLOWED_PERMISSION_IDS_();
  }));

  it('Verify PromotionsData for Store user', function() {
    var promo=PromotionData(allowedPermissionIds.STORE);
    expect(promo.purchaseConds.channels[0]).toBe(87);
    expect(promo.purchaseConds.locations.length).toBe(0);
    expect(promo.printLabel).toBe(false);
  });
  it('Verify PromotionsData for Online user', function() {
    var promo=PromotionData(allowedPermissionIds.ONLINE);
    expect(promo.purchaseConds.channels[0]).toBe(57);
    expect(promo.purchaseConds.locations[0]).toBe(8119);
    expect(promo.printLabel).toBe(false);
  });
});
