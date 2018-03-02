/* eslint-disable no-unused-vars */
describe('Unit testing  system-generated-codes directive', function () {
    var $compile,
        $rootScope,
        $scope,
        element,
        $httpBackend;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));
    beforeEach(function(){
        module('app', function($provide) {
            $provide.constant('MaxCouponGenerationLimit', 300000);
        });
    });
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        var reponse = {
            'cdLength': 2,
            'type': null,
            'genType': null,
            'systemGen': {
                'numberOfUniqueCodes': 2500,
                'uniqueCdCnt': 2,
                'cdSuffix': 'a',
                'cdPrefix': 'pre'
            },
            'lastUpdateUser': null,
            'lastUpdatedTS': null,
            'couponId': null,
            'promoCodes': ['preQHa', 'preOSa']
        };
      // backend definition common for all tests

        var authRequestHandler = $httpBackend.when('POST', '/couponRequest/preview')
        .respond(200, reponse);

    }));

    //TODO:check why there is a call every time a input value changes
    it('Checks if the content  is rendered', function () {
        $scope.data = {
            'uniqueCdCnt': 2,
            'cdPrefix': 'pre',
            'cdSuffix': 'a'
        }
        $scope.cdlength = 5;
        // Compile a piece of HTML containing the directive
        element = $compile('<system-generated-codes cdlength=\'5\' data=\'data\'><system-generated-codes>')($scope);
        $httpBackend.flush();
        $scope.$digest();
        // Check if the example promocodes are displayed
        expect(element.html()).toContain('preQHa');
        expect(element.html()).toContain('preOSa');
    });
});
