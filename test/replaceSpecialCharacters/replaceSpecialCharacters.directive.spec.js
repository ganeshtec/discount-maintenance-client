describe('Replace Special character directive', function() {
  var $scope,
      element,
      ngModelCtrl;
   var triggerKeyDown = function(element, keyCode) {
    var e = $.Event('keypress');
    e.which = keyCode;
    element.trigger(e);
  };
  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_ ){
    var $compile = _$compile_;
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.testValue='Hello World';
    element = angular.element('<input ng-model="testValue" replace-special-characters></input>');
    $compile(element)($scope);
    $scope.$digest();
    ngModelCtrl = element.controller('ngModel');                           
  }));

  it('Valid characters should not be modified', function() {
    ngModelCtrl.$setViewValue("save 10% with promocode (Lithonia2017)? until 6/30");
    expect($scope.testValue).toEqual('save 10% with promocode (Lithonia2017)? until 6/30');
  });
  it('Should substitute special quotes with regular quotes', function() {
    ngModelCtrl.$setViewValue("save 10% with promocode “Lithonia2017”? until 6/30");
    expect($scope.testValue).toEqual('save 10% with promocode "Lithonia2017"? until 6/30');
  });
  it('Should remove invalid characters', function() {
    ngModelCtrl.$setViewValue("save 10% with promocode <Lithonia2017>? until 6/30");
    expect($scope.testValue).toEqual('save 10% with promocode Lithonia2017? until 6/30');
    //expect(element.html()).toContain('save 10% with promocode Lithonia2017? until 6/30');
  });
  it('Empty input should not fail', function() {
    ngModelCtrl.$setViewValue("");
    expect($scope.testValue).toEqual('');
  });
  it('Invlid characters should be prevented from being keyed in',function(){
    triggerKeyDown(element,91)//simulate entering open square bracket key
    expect($scope.isLastKeyValid).toEqual(false);
  })
  it('Should be able to key-in allowed characters',function(){
    triggerKeyDown(element,65);//simulate entering character 'a'
    expect($scope.isLastKeyValid).toEqual(true);
  })
});