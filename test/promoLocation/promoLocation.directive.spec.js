fdescribe('Unit testing promoLocation.directive.spec.js', function () {
  var $compile,
    $rootScope,
    $scope,
    element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    var itemSearch = [];


    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();

    this.$isolateScope = element.isolateScope();
  }));



  // test conditions for store location search functionality  //TEST - 4

  // it('Checks if store  search functionality defined', function() {

  //   var itemSearch = [];

  // // Contain a piece of HTML containing the Directive  
  //     var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
  //     $scope.$digest();
  //     this.$isolateScope = element.isolateScope();
  //     spyOn(this.$isolateScope, "search").and.callThrough();
  //     this.$isolateScope.search('121345');
  //     expect(this.$isolateScope.search).toHaveBeenCalled();      
  //     expect(this.$isolateScope.inValidStoreInfo).toBe(false);
  //     expect(this.$isolateScope.showInvalidError).toBe(false);

  //  });  




  // test conditions for market location search functionality    //TEST - 8

  // it('Checks if market  search functionality defined', function() {

  //     var itemSearch = [];

  //   // Contain a piece of HTML containing the Directive  
  //       var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
  //       $scope.$digest();
  //       this.$isolateScope = element.isolateScope();
  //       spyOn(this.$isolateScope, "search").and.callThrough();

  //       this.$isolateScope.search('1');

  //       expect(this.$isolateScope.search).toHaveBeenCalled();

  //       expect(this.$isolateScope.inValidStoreInfo).not.toBe(undefined);
  //       expect(this.$isolateScope.showInvalidError).not.toBe(undefined);

  // });

  //Verify error is thrown when item already exists
  //Verify item is added to item table if data service response is valid
  //Verify if negative number is added to Store list error is thrown
  //Verify that when stores are added with spaces or comas or semicolons the list is recognised
  //Verify that when invalid Market number is added that error is thrown
  //Verify that when markets are added with spaces or commas or semicolons the list is recognised
  //Verify thet when Markets with alpha numeric data is entered an error is thrown
  //Verify that when Market and Store service does not return correct status code, application does not crash
  //Verify that when store service returns 3 stores, they are passed on to the html


  //Verify functionality of markets -> store list translation service


  //Tests to make sure space, comma seperated list is converted into comma seperated array
  it("Test for formatToCommaSeparatedList method for space seperated input", function () {
    expect(this.$isolateScope.formatToCommaSeparatedList("1 4 5")).toEqual(['1', '4', '5']);
  });


  it("Test for formatToCommaSeparatedList method for comma seperated input", function () {

    expect(this.$isolateScope.formatToCommaSeparatedList("1, 4, 5")).toEqual(['1', '4', '5']);

  });


  it("Test for formatToCommaSeparatedList method for comma and space seperated input", function () {

    expect(this.$isolateScope.formatToCommaSeparatedList("1 4, 5")).toEqual(['1', '4', '5']);

  });

  //Tests to make sure input location list are numeric


  it("Checks isLocationDataValid method functionality returns true for numeric values", function () {
    
    expect(this.$isolateScope.isLocationDataValid(['1', '121', '5'])).toEqual(true);


  });

  it("Checks isLocationDataValid method functionality returns false for alphanumeric values", function () {
    
    expect(this.$isolateScope.isLocationDataValid(['1a', '4', '5'])).toEqual(false);
    //expect(this.$isolateScope.isLocationDataValid(['1','-4','5'])).toEqual(false);

  });

  it("Checks isLocationDataValid method functionality returns false for empty array ", function () {
    
    expect(this.$isolateScope.isLocationDataValid([])).toEqual(false);


  });

  



});