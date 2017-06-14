describe('Unit testing itemInclusion.component.spec.js', function() {
  var $componentController,
      $compile,
      $rootScope,
      $scope,
      element,
      itemsDataService,
      $q;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_,_$componentController_,_$rootScope_,_itemsDataService_,_$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $q = _$q_;
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
   // $scope = $rootScope.$new();
    itemsDataService = _itemsDataService_;

    ctrl = $componentController('itemInclusion', null, {
            data: {}

        });




  }));

  it('Checks if item-inclusion component is rendering item skus', function() {
    var itemData = ['1000317883','100049'];
    spyOn(itemsDataService, 'getSkuIDs').and.returnValue(itemData);
    spyOn(itemsDataService, 'getSkuIdCodes').and.callFake(function () {
        console.log("Intercepted")
        deferredResult =$q.defer();
        deferredResult.resolve({
                validSkuInfo: [
                    {
                        omsId: null,
                        prodName: null,
                        skuDescription: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                        skuNumber: 1000317883,
                        skuTypeCode: 'S'
                    },
                    {
                        omsId: null,
                        prodName: null,
                        skuDescription: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                        skuNumber: 100049,
                        skuTypeCode: 'N'
                    },
                ],
                inValidSkuInfo: [{
                }
                ],
                skuCountList: [
                    {
                        "skuTypeCode": "S",
                        "skuCount": 1

                    },
                    {
                        "skuTypeCode": "N",
                        "skuCount": 1

                    }
                ]
        });
        return deferredResult.promise;
    })
    // Compile a piece of HTML containing the directive
    $rootScope.itemData=itemData;
    $rootScope.itemtype='SKU';
    var element = $compile("<item-inclusion data='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("Sku");
    expect(element.html()).toContain("Description");
    expect(element.html()).toContain("SMOOTH FLUSH SOLID CORE PRIMED CHROM");
    expect(element.html()).toContain('16"X16" MONTAGNA BELLUNO-15.5SF CA');

  });

  it('Checks if item-inclusion component is rendering item oms ids', function() {
    var itemData = ['1000317883','100049'];
    spyOn(itemsDataService, 'getOmsIDs').and.returnValue(itemData);
    spyOn(itemsDataService, 'getOmsIdCodes').and.callFake(function () {
        console.log("Intercepted")
        deferredResult =$q.defer();
        deferredResult.resolve({
                validOmsInfo: [
                    {
                        omsId: 999999999,
                        prodName:  'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                        skuNumber: 1000317883,
                        skuTypeCode: 'S'
                    },
                    {
                        omsId: 888888888,
                        prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                        skuNumber: 100049,
                        skuTypeCode: 'N'
                    },
                ],
                inValidOmsInfo: [{
                }
                ]
        });
        return deferredResult.promise;
    })
    // Compile a piece of HTML containing the directive
    $rootScope.itemData=itemData;
    $rootScope.itemtype='OMS';
    var element = $compile("<item-inclusion data='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("Please enter a valid 9 digit OMS ID");
     expect(element.html()).toContain("OMS ID");
     expect(element.html()).toContain("Sku");
    expect(element.html()).toContain("Description");
    expect(element.html()).toContain('999999999');
    expect(element.html()).toContain('1000317883');
    expect(element.html()).toContain("SMOOTH FLUSH SOLID CORE PRIMED CHROM");

  });

  it('Checks if remove item works', function() {
     var itemData = []
    // Compile a piece of HTML containing the directive
    var element = $compile("<item-inclusion data='itemData'></item-inclusion>")($scope);
    $scope.$digest();
  //  $isolatedScope = element.isolateScope();

    ctrl.removePromoCode(0);
    ctrl.removeAll();
    ctrl.clear();

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