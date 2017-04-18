describe('Unit testing promo schedule directive', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      leadTimeService;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _leadTimeService_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    leadTimeService = _leadTimeService_;

    $scope.data = {
    };
    element = $compile("<promo-schedule data='data'><promo-schedule>")($scope);
    $scope.$digest();
    this.$isolateScope = element.isolateScope();
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



  it('isEndDateValid function should return true when end date is greater than minimun end date', function() {
    
    this.$isolateScope.data.endDt = '2017-05-10'
    this.$isolateScope.data.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountCS';  
    this.$isolateScope.data.leadTime = 0; 

    expect(this.$isolateScope.isEndDateValid('2017-05-08')).toEqual(true);

  })

  it('isEndDateValid function should return false when end date is less than minimum end date', function() {
    
    this.$isolateScope.data.endDt = '2017-03-10'
    this.$isolateScope.data.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountCS';
    this.$isolateScope.data.leadTime = 0; 

    expect(this.$isolateScope.isEndDateValid('2017-05-08')).toEqual(false);
  })

it('Calls lead time service for MSB', function() {
  this.$isolateScope.promoform = {};
  this.$isolateScope.promoform.end = {};
  this.$isolateScope.promoform.end.$invalid = {};
  this.$isolateScope.promoform.end.$error = {};
  this.$isolateScope.formHolder = {};
  this.$isolateScope.formHolder.form = {};
  this.$isolateScope.data.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountMSB';

  spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function(){
      return {then: function(callback) { return callback(3)}
    }})

    this.$isolateScope.validateEndDate();

    expect(this.$isolateScope.data.minEndDate).toEqual(this.$isolateScope.getMinEndDate(3));

})

it('Does not call lead time Service for CS', function() {
  this.$isolateScope.promoform = {};
  this.$isolateScope.promoform.end = {};
  this.$isolateScope.promoform.end.$invalid = {};
  this.$isolateScope.promoform.end.$error = {};
  this.$isolateScope.formHolder = {};
  this.$isolateScope.formHolder.form = {};
  this.$isolateScope.data.promoSubTypeCd = 'ProductLevelPerItemPercentDiscountCS';

  this.$isolateScope.validateEndDate(this.$isolateScope);

  expect(this.$isolateScope.promoform.end.$invalid).toEqual(false);
  })

});