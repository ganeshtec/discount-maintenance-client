xdescribe('Unit testing itemInclusion.directive.spec.js', function() {
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

  it('Checks if add item works', function() {
    var itemData = []
    // Compile a piece of HTML containing the directive
    var element = $compile("<item-inclusion data='itemData'></item-inclusion>")($scope);
    $scope.$digest();
    $isolatedScope = element.isolateScope();

    var item= {"omsId": "202716986", "skuDescription": "WALL MOUNT 2-HANDLE ELEGANT SPOUT BA", "skuNumber": "1001299255", "prodName": "SDTR180 80 Grit Red Detail Triangle 5 Pack"}



  });

  it('Checks if remove item works', function() {
     var itemData = []
    // Compile a piece of HTML containing the directive
    var element = $compile("<item-inclusion data='itemData'></item-inclusion>")($scope);
    $scope.$digest();
    $isolatedScope = element.isolateScope();

    $isolatedScope.removePromoCode(0);
    $isolatedScope.removeAll();
    $isolatedScope.clear();

  });

// test conditions for item skus

// test condition validate the place holder for item sku search.

  it('Checks if sku item placeholder works', function() {


    // Contain a piece of HTML containing the Directive
    var element = $compile("<item-inclusion></item-inclusion>")($scope);
    $scope.$digest();


    expect(element.html()).toContain("Search and Add Item Sku Number");

  });

  // test conditions for item skus search error message

  it('Checks if sku item search displays error message', function() {

    // Contain a piece of HTML containing the Directive
        var element = $compile("<item-inclusion></item-inclusion>")($scope);
        $scope.$digest();


        expect(element.html()).toContain("Please enter a valid Sku Number");

  });

// test conditions for item skus search functionality is defined

  it('Checks if sku item search functionality defined', function() {

      var validSkuInfo = [];

    // Contain a piece of HTML containing the Directive
        var element = $compile("<item-inclusion data='validSkuInfo'> </item-inclusion>")($scope);
        $scope.$digest();
        this.$isolateScope = element.isolateScope();
        spyOn(this.$isolateScope, "search").and.callThrough();

        this.$isolateScope.search('1234567');

        //expect(this.$isolateScope.search).toBeDefined();
        expect(this.$isolateScope.search).toHaveBeenCalled();

        expect(this.$isolateScope.isSkuSearch).not.toBe(undefined);

  });



});
