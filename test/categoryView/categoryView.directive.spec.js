describe('Unit testing Promotion Header directive', function() {
  var $compile,
      $rootScope,
      $scope;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _loginService_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    loginService = _loginService_;
    $scope = $rootScope.$new();

    spyOn(loginService, 'intercept').and.callFake(function () {
    })

  }));

  it('Checks if heading is constructed according to input data  ', function() {
    // Compile a piece of HTML containing the directive

    $scope.items = {hierarchies:[
        {
          'name': 'Sample Name and Description 1',
          'id': 'gh121278023g',
          'inclusions':{'hierarchies':{}}
        },
        {
          'name': 'Sample Name and Description 2',
          'id': 'gh121278023h',
          'inclusions':{'hierarchies':{}}
        },
      ]}
    var element = $compile("<category-view hierarchiesparent='items'></category-view>>")($scope);
    $rootScope.$digest();

    expect(element.html()).toContain("Search and Add Category");
  });

  it('check if search promotions work', function() {

    // Test helpers
      var JasmineHelpers = function () {

          var deferredSuccess = function (args) {
              var d = $.Deferred();
              d.resolve(args);
              return d.promise();
          };

          var deferredFailure = function (args) {
              var d = $.Deferred();
              d.reject(args);
              return d.promise();
          };

          return {
              deferredSuccess: deferredSuccess,
              deferredFailure: deferredFailure
          };
      };



      var jasmineHelpers = new JasmineHelpers();


   $scope.items = {hierarchies:[
        {
          'name': 'Sample Name and Description 1',
          'id': 'gh121278023g',
          'inclusions':{'hierarchies':{}}
        },
        {
          'name': 'Sample Name and Description 2',
          'id': 'gh121278023h',
          'inclusions':{'hierarchies':{}}
        },
      ]}
    var element = $compile("<category-view hierarchiesparent='items'></category-view>>")($scope);

   $rootScope.$digest();
   var isolateScope = element.isolateScope();

   spyOn(isolateScope, "search").and.callFake(function() {
       jasmineHelpers.deferredSuccess();
     });

   $rootScope.$digest();

   expect(element.html()).toContain("Search");



  });
});
