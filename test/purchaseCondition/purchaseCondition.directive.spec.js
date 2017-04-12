describe('Unit testing purchaseCondition.directive.spec.js', function() {
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
 
 
    it('Checks directive with the appropriate content.', function() {

        $scope.data= [];
        // Compile a piece of HTML containing the directive
        var element = $compile('<purchase-condition data=\'data\'></purchase-condition>')($scope);
        $scope.$digest();
        $isolatedScope = element.isolateScope();

    // Check that the compiled element contains the templated content
    //  expect(element.html()).toContain("Add New Condition");
    });
 
   
    it('adding object in purchaseCondition array', function() {
        $isolatedScope.addPurchaseCondition();
        expect($isolatedScope.data.length).toEqual(2);
    });
    
    it('remove function in purchaseCondition array', function() {   
        expect($isolatedScope.data.length).toEqual(2);
        $isolatedScope.removePurchaseCondition($isolatedScope.data.length-1);
        expect($isolatedScope.data.length).toEqual(1);
    }); 
  
    it('rounds percentages to two decimal places', function() {
        $isolatedScope.data[1] = {};

        $isolatedScope.data[1].value = '50.759';
        $isolatedScope.roundPercentage(1);
        expect($isolatedScope.data[1].value).toEqual('50.76');

        $isolatedScope.data[1].value = '45.94212';
        $isolatedScope.roundPercentage(1);
        expect($isolatedScope.data[1].value).toEqual('45.94');

        $isolatedScope.data[1].value = '150';
        $isolatedScope.roundPercentage(1);
        expect($isolatedScope.data[1].value).toEqual('100');
    });
});