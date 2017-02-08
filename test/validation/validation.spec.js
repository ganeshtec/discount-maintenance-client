describe('Unit testing adminPromotionForm.directive.spec.js', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
	  promotionDataService,
	  $httpBackend,
    promoData;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _promotionDataService_, _$httpBackend_,_PromotionData_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
	promotionDataService = _promotionDataService_;
    $httpBackend = _$httpBackend_;		
    promoData = _PromotionData_;
     // backend definition common for all tests 
    var authRequestHandler = $httpBackend.when('GET', '/promotionTypes/promotionSubTypes/adminUI.json')
                            .respond(200);
	
  }));


  it('Check validations for save as draft', function() {
    // Compile a piece of HTML containing the directive
	$scope.data= new promoData();
//  console.log($scope.data);
  $scope.holder = {};
 	//$scope.promoform= [];
  var element = $compile("<admin-promotion-form data='data' form-holder='holder'></admin-promotion-form>")($scope);
  $scope.$digest();
	$isolatedScope = element.isolateScope();
   console.log('errors'); 
//   console.log($scope.holder.form.name.$valid);
   expect($scope.holder.form.$valid).toBe(true);
    var error = $scope.holder.form.$error;
    angular.forEach(error.required, function(field){
        if(field.$invalid){
            var fieldName = field.$name;
           console.log(fieldName);
        }
    });
//    console.log('pattern');
       angular.forEach(error.pattern, function(field){
        if(field.$invalid){
            var fieldName = field.$name;
           console.log(fieldName);
        }
    });
    // Check that the compiled element contains the templated content
   // expect(element.html()).toContain("Promotion Name");
  });

  it('Checks validations for sumit for approval.', function() {
    // Compile a piece of HTML containing the directive
  $scope.data= new promoData();
  $scope.holder = {};
  //$scope.promoform= [];
  var element = $compile("<admin-promotion-form data='data' preview='true' form-holder='holder'></admin-promotion-form>")($scope);
  $scope.$digest();
  $isolatedScope = element.isolateScope();
//   console.log($scope.holder.form)
//   console.log($scope);
//   console.log('errors'); 
//   console.log($scope.holder.form.$valid)
//   console.log($scope.holder.form.name.$valid);
//   console.log($scope.holder.form.priority.$valid);
     var error = $scope.holder.form.$error;
       angular.forEach(error.required, function(field){
        if(field.$invalid){
            var fieldName = field.$name;
           console.log(fieldName);
        }
    });
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Promotion Name");
  });
});