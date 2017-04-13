describe('Unit testing promo schedule directive', function() {
  var $compile,
      $rootScope,
      $scope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  //TODO: rewrite test after the directive code fetches data from back end
  it('Checks if the content  is rendered', function() {
    $scope.data = {};
    // Compile a piece of HTML containing the directive
    element = $compile("<promo-schedule data='data'><promo-schedule>")($scope);
    $scope.$digest();
   // Check that the compiled element contains the templated content
    expect(element.html()).toContain('Start Date');
    expect(element.html()).toContain('End Date');
  });


  it('Sets leadTime from WS if MSB discount', function() {

    var itemSearch = [];  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();
    this.$isolateScope = element.isolateScope();
    this.$isolateScope.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountMSB'
    spyOn(this.$isolateScope.fetchLeadTime()).and.Return(3);

    expect(this.$isolateScope.getLeadTime()).toEqual(3);

  })

  it('Sets leadTime to zero if CS discount', function() {

    var itemSearch = [];  
    var element = $compile("<promo-location data='itemSearch'></promo-location>")($scope);
    $scope.$digest();
    this.$isolateScope = element.isolateScope();
    this.$isolateScope.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountCS'
    spyOn(this.$isolateScope.fetchLeadTime())

    expect(this.$isolateScope.getLeadTime()).toEqual(0)
    expect(this.$isolateScope.fetchLeadTime()).isNotCalled();

  })

  


});