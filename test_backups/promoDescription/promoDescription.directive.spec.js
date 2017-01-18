describe('Unit testing promo description directive', function() {
  var $compile,
      $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Checks directive with the appropriate content', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<promo-description></promo-description>")($rootScope);
   
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("shortDesc, longDesc");
  });
});