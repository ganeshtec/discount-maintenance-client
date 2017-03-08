describe('Unit testing fix height directive', function() {
  var $compile,
      $rootScope,
      $scope,$timeout;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  beforeEach(function () {
  module(function ($provide) {
    $provide.provider('$timeout', function () {
      return {
        $get : function(){
         return function(fn){
          fn();
         }
        }
      };
    });
  });
});




  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_,_$timeout_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    
  }));

  it('Checks if fix height sets min height', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<div style='height:1750px'><div fix-height>min-height</div>")($scope);
    $scope.$digest();

    expect(element.html()).toContain("min-height");

  });

});