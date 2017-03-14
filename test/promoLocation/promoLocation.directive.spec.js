describe('Unit testing promoLocation.directive.spec.js', function() {
  var $compile,
      $rootScope,
      $scope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));
  
  
// test condition validate the place holder for store location search.
  
  it('Checks if store location placeholder works', function() {
    
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location></promo-location>")($scope);
    $scope.$digest();
    
    expect(element.html()).toContain("Search and Add Store Number");
      
  });
  
// test condition validate error message for store location search.
  
  it('Checks if store location placeholder works', function() {
    
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location></promo-location>")($scope);
    $scope.$digest();
    
    expect(element.html()).toContain("Please enter a valid Store Number");
      
  });

  
// test conditions for store location search functionality
  
  it('Checks if store  search functionality defined', function() {
      
      var itemSearch = [];
     
    // Contain a piece of HTML containing the Directive  
        var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
        $scope.$digest();
        this.$isolateScope = element.isolateScope();
        spyOn(this.$isolateScope, "search").and.callThrough();
        
        this.$isolateScope.search('121');
        
        expect(this.$isolateScope.search).toHaveBeenCalled();
        
        expect(this.$isolateScope.inValidStoreInfo).not.toBe(undefined);
        expect(this.$isolateScope.showInvalidError).not.toBe(undefined);
      
  });



  
});