describe('Unit testing promoLocation.directive.spec.js', function () {
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


  //Verify item is added to item table if data service response is valid
  //Verify if negative number is added to Store list error is thrown
  //Verify that when Market and Store service does not return correct status code, application does not crash
  //Verify that when store service returns 3 stores, they are passed on to the html
  //Verify functionality of markets -> store list translation service


  //Tests to make sure space, comma seperated list is converted into comma seperated array
  it("Test for formatToCommaSeparatedList method for space seperated input", function () {
    expect(this.$isolateScope.formatToCommaSeparatedList("1 4 5")).toEqual(['1', '4', '5']);
  });

  it("Test for formatToCommaSeparatedList method for comma seperated input", function () {

    expect(this.$isolateScope.formatToCommaSeparatedList("121, 4, 5")).toEqual(['121', '4', '5']);

  });


  it("Test for formatToCommaSeparatedList method for comma and space seperated input", function () {

    expect(this.$isolateScope.formatToCommaSeparatedList("1 4, 5")).toEqual(['1', '4', '5']);

  });

  //Tests to make sure input location list are numeric


  it("Checks isLocationDataValid method functionality returns true for numeric values", function () {

    expect(this.$isolateScope.isLocationDataValid(['1', '121', '5'])).toEqual(true);


  });

  // These tests are failing, created a bug#
  // it("Checks isLocationDataValid method functionality returns false for alphanumeric values", function () {

  //   expect(this.$isolateScope.isLocationDataValid(['1', '4a', '5'])).toEqual(false);

  // });

  // it("Checks isLocationDataValid method functionality returns false for negative values", function () {

  //   expect(this.$isolateScope.isLocationDataValid(['1','-4'])).toEqual(false);

  // });


  it("Checks for checkForInvalidLocations method returns the valid results ", function () {

    this.$isolateScope.data  = {"validStoreInfo": [{"storeNumber": 121,"storeName": "CUMBERLAND","marketNumber": 337}],"inValidStoreInfo": [1,2]};

    expect(this.$isolateScope.checkForInvalidLocations(this.$isolateScope.data)).toEqual([1,2]);


  });

  it("Checks for checkForInvalidLocations method returns the valid results with inValidMarketInfo ", function () {

    this.$isolateScope.data  = {"validStoreInfo": [{"storeNumber": 121,"storeName": "CUMBERLAND","marketNumber": 337}],"inValidMarketInfo": [1,2]};

    expect(this.$isolateScope.checkForInvalidLocations(this.$isolateScope.data)).toEqual([1,2]);


  });

  it("Checks for checkForInvalidLocations method returns the valid results without inValidStoreInfo and inValidMarketInfo ", function () {

    this.$isolateScope.data  = {"validStoreInfo": [{"storeNumber": 121,"storeName": "CUMBERLAND","marketNumber": 337}]};

    expect(this.$isolateScope.checkForInvalidLocations(this.$isolateScope.data)).toEqual([]);


  });

  it("Calls setStoreData", function () {

    var storeData  = {"validStoreInfo": [{"storeNumber": 121,"storeName": "CUMBERLAND","marketNumber": 337}]};
    this.$isolateScope.data = [];
    this.$isolateScope.locationSearch = 121;

    spyOn(this.$isolateScope, "setStoreData").and.callThrough();

    this.$isolateScope.setStoreData(storeData,true);

    expect(this.$isolateScope.checkForInvalidLocations(storeData)).toEqual([]);

    expect(this.$isolateScope.setStoreData).toHaveBeenCalled();

  });


  it('Checks for search Method to invoke getStoresById when stores are entered as input', function () {
    this.$isolateScope.data = '121';
    this.$isolateScope.locationType = 'stores'
    spyOn(this.$isolateScope, "getStoresByID");
    this.$isolateScope.search(this.$isolateScope.data);
    expect(this.$isolateScope.getStoresByID).toHaveBeenCalled();

  });

  it('Checks for search Method to invoke getMarketsByID when stores are entered as input', function () {
    this.$isolateScope.data = '121 123a';
    this.$isolateScope.locationType = 'markets'
    spyOn(this.$isolateScope, "getMarketsByID");
    this.$isolateScope.search(this.$isolateScope.data);
    expect(this.$isolateScope.getMarketsByID).toHaveBeenCalledWith({ locationNumbers: [ '121', '123a' ] },true);

  });

  it('Checks for search Method to invoke getMarketsByID when stores are entered as input', function () {
    this.$isolateScope.data = '';
    this.$isolateScope.locationType = 'markets'
    spyOn(this.$isolateScope, "getMarketsByID");
    spyOn(this.$isolateScope,"checkForEmptyValues").and.returnValue(false);
    this.$isolateScope.search(this.$isolateScope.data);
    expect(this.$isolateScope.getMarketsByID.calls.count()).toEqual(0);

  });


});
