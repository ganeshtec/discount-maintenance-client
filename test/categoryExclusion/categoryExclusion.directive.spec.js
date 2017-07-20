describe('Unit testing categoryExclusion.directive.spec.js', function() {
  var $compile,
      $rootScope,
      $scope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    _$httpBackend_.when('GET', '/skutypes/')
                  .respond(200,[]); 
  }));

  it('verify Items/SKU radio button displays only if displayItemsSku view property is set to true',function(){
      $scope.viewProp={displayItemsSku:true}
      $scope.data={};
      $scope.itemType='ANY';
      $scope.promoFrom={};
      var element=$compile("<category-exclusion data='data' view-prop='viewProp' promo-form='promoForm' item-type='itemType'></category-exclusion>")($scope);
      $scope.$digest();
      expect(element.find("div[id='itemssku_exclude_div']").attr('aria-hidden')).toBe('false');
  });
  
});