describe('skuTypesDataService', function () {
  var dataService,
    skuTypesDataService,
    $q,
    $rootScope,
    deferredResult;
  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_dataService_,_skuTypesDataService_,_$q_,_$rootScope_, _loginService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    dataService = _dataService_;
    skuTypesDataService = _skuTypesDataService_;
    loginService = _loginService_;
    $q=_$q_;
    $rootScope=_$rootScope_;
    spyOn(loginService, 'intercept').and.callFake(function () {
    })
  }));

  it('Fetch Sku Types should return a promise with list of SkuType objects', function () {
    spyOn(dataService, 'httpRequest').and.callFake(function () {
      deferredResult =$q.defer();
      deferredResult.resolve({"data":[{"skuTypeCode": "N","description": "N - Normal"}]});
      return deferredResult.promise;
    })
    var skuTypesPromise = skuTypesDataService.fetchSkuTypes();
    var skuTypes;
    skuTypesPromise.then(function (value) {
      skuTypes = value;
    });
    $rootScope.$apply();
    expect(skuTypes).toBeDefined();
    expect(skuTypes[0].skuTypeCode).toEqual('N');
    expect(skuTypes[0].description).toEqual('N - Normal');
  });

  it('List of SKU Types should be cached to reduce the number of backend calls', function () {
    spyOn(dataService, 'httpRequest').and.callFake(function () {
      deferredResult =$q.defer();
      deferredResult.resolve({"data":[{"skuTypeCode": "N","description": "N - Normal"}]});
      return deferredResult.promise;
    })
    var skuTypesPromise = skuTypesDataService.fetchSkuTypes();
    var skuTypes;
    skuTypesPromise.then(function (value) {
      skuTypes = value;
    });
    $rootScope.$apply();
    expect(skuTypes).toBeDefined();
    skuTypesDataService.fetchSkuTypes();
    skuTypesDataService.fetchSkuTypes();
    expect(dataService.httpRequest).toHaveBeenCalledTimes(1);
  });

});
