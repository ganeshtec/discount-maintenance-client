// fdescribe('Replace Special characterr directive', function () {
//   'use strict';
//   var scope,
//       element,
//       testValue,
//       compile,
//       ngModelCtrl;

//   beforeEach(function () {
//     module('app');

//     compile = function () {
//       inject([
//         '$compile',
//         '$rootScope',
//         function ($compile, $rootScope) {
//           scope = $rootScope.$new();
//           scope.testValue = testValue;
//           element = angular.element('<input ng-model="testValue" replace-special-characters></input>');
//           $compile(element)(scope);
//           ngModelCtrl = element.controller('ngModel');
//           scope.$digest();
//         }
//       ]);
//     };
//   });
// //   describe('initialization', function () {
// //     beforeEach(function () {

// //     });
//     it('Opening and closing quote characters should be replaced with regular quotes', function () {
//        testValue = '<save 10% with promocode “Lithonia2017”? until 6/30>';
//       compile();
//       ngModelCtrl.$setViewValue(testValue);
//       scope.$digest();
//       expect(scope.testValue).toEqual('save 10% with promocode "Lithonia2017"? until 6/30');
//     });
// //   });
// });

describe('Replace Special character directive', function() {
  var $scope,
      element,
      ngModelCtrl;
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
  });
  it('Empty input should not fail', function() {
    ngModelCtrl.$setViewValue("");
    expect($scope.testValue).toEqual('');
  });
});