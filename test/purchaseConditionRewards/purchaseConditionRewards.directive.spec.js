describe('Unit testing purchaseConditionRewards.directive.spec.js', function() {
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
  
// test condition check all the labels for Customer Segment.
  
  it('Checks if Segment Labels are present in HTML', function() {
	//var item= [];
	$scope.data= [];
	
	// Contain a piece of HTML containing the Directive  
	var element = $compile("<purchase-condition-rewards data='data'></purchase-condition-rewards>")($scope);
	$scope.$digest();
	//$isolateScope = element.isolateScope();
	
	expect(element.html()).toContain("Customer Segment");
	
	  
  });
  
// test condition check all valid functions present in Customer Segment.
  
  it('Checks if Segment functions are present Customer Segment JS', function() {
	//var item= [];
	$scope.data= [];
	
	// Contain a piece of HTML containing the Directive  
	var element = $compile("<purchase-condition-rewards data='data'></purchase-condition-rewards>")($scope);
	$scope.$digest();
	this.$isolateScope = element.isolateScope();
	
	// validate OnSegmentChange method
	spyOn(this.$isolateScope, "onSegmentSelection").and.callThrough();
	this.$isolateScope.onSegmentSelection('1');
	expect(this.$isolateScope.onSegmentSelection).toHaveBeenCalled();
 
  });
  
 
});