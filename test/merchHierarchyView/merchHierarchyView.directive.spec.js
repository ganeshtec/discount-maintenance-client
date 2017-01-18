describe('Unit testing merchHierarchyView.directive.spec.js', function() {
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

  
// test condition check all the labels for MerchHierarchy View.
  
  it('Checks if Merch Labels are present in HTML', function() {
	var item= [];
	
	// Contain a piece of HTML containing the Directive  
	var element = $compile("<merch-hierarchy-view data='item'></merch-hierarchy-view>")($scope);
	$scope.$digest();
	//$isolateScope = element.isolateScope();
	
	expect(element.html()).toContain("Merch Hierarchy");
	expect(element.html()).toContain("Select Department");
	expect(element.html()).toContain("Select class");
	expect(element.html()).toContain("Select subclass");
	  
  });
  
// test condition to validate methods for MerchHierarchy View.
  
  it('Checks if Merch Labels are present in HTML', function() {
	var item= [];
	
	// Contain a piece of HTML containing the Directive  
	var element = $compile("<merch-hierarchy-view data='item'></merch-hierarchy-view>")($scope);
	$scope.$digest();
	this.$isolateScope = element.isolateScope();
	
	// validate getClasses method
	spyOn(this.$isolateScope, "getClassesforSelectedDepartment").and.callThrough();
	this.$isolateScope.getClassesforSelectedDepartment('1');
	expect(this.$isolateScope.getClassesforSelectedDepartment).toHaveBeenCalled();
	
	// validate getSubClasses method
    spyOn(this.$isolateScope, "getSubClasses").and.callThrough();
	this.$isolateScope.getSubClasses('1','2');
	expect(this.$isolateScope.getSubClasses).toHaveBeenCalled();

    // validate Delete and Add methods
	spyOn(this.$isolateScope, "deleteRow");
	this.$isolateScope.deleteRow('merch','1');
	expect(this.$isolateScope.deleteRow).toHaveBeenCalled();
	
    spyOn(this.$isolateScope, "showData");
	this.$isolateScope.showData();
	expect(this.$isolateScope.showData).toHaveBeenCalled();


	  
  });


  
});