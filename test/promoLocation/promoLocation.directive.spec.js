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
    var itemSearch = [];
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();
    
    expect(element.html()).toContain("Search and Add Store Number");
      
  });
  
// test condition validate error message for store location search.
  
  it('Checks if valid store location enetered', function() {
    var itemSearch = [];
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
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

// test condition validate the place holder for market location search.
  
  it('Checks if market location placeholder works', function() {
    var itemSearch = [];
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();
    
    expect(element.html()).toContain("Search and Add Market Number");
      
  });
  
// test condition validate error message for market location search.
  
  it('Checks if valid market location enetered', function() {
    var itemSearch = [];
    // Contain a piece of HTML containing the Directive  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();
    
    expect(element.html()).toContain("Please enter a valid Market Number");
      
  });

  // test conditions for market location search functionality
  
  it('Checks if market  search functionality defined', function() {
      
      var itemSearch = [];
     
    // Contain a piece of HTML containing the Directive  
        var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
        $scope.$digest();
        this.$isolateScope = element.isolateScope();
        spyOn(this.$isolateScope, "search").and.callThrough();
        
        this.$isolateScope.search('1');
        
        expect(this.$isolateScope.search).toHaveBeenCalled();
        
        expect(this.$isolateScope.inValidStoreInfo).not.toBe(undefined);
        expect(this.$isolateScope.showInvalidError).not.toBe(undefined);
      
  });

  //Verify error is thrown when item already exists
  //Verify item is added to item table if data service response is valid
  //Verify if negative number is added to Store list error is thrown
  //Verify that when stores are added with spaces or comas or semicolons the list is recognised
  //Verify that when invalid Market number is added that error is thrown
  //Verify that when markets are added with spaces or commas or semicolons the list is recognised
  //Verify thet when Markets with alpha numeric data is entered an error is thrown
  //Verify that when Market and Store service does not return correct status code, application does not crash
  //Verify that when store service returns 3 stores, they are passed on to the html

  
  it('Checks if market  search functionality defined', function() {
      
      var itemSearch = [];
     
    // Contain a piece of HTML containing the Directive  
        var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
        $scope.$digest();
        this.$isolateScope = element.isolateScope();
        spyOn(this.$isolateScope, "search").and.callThrough();
        
        this.$isolateScope.search('1');
        
        expect(this.$isolateScope.search).toHaveBeenCalled();
        
        expect(this.$isolateScope.inValidStoreInfo).not.toBe(undefined);
        expect(this.$isolateScope.showInvalidError).not.toBe(undefined);
      
  });



  
});