describe('Unit testing infoBanner.component.spec.js', function () {
    var $compile,
        $rootScope,
        utilService,
        $scope;


    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _utilService_ ) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        utilService = _utilService_;

        $scope = $rootScope.$new();

    }));

    it('Checks if content renders.', function () {

        spyOn(utilService, 'getLeadTime').and.callFake(function () {
            return {
                then: function (callback) { return callback(3) }
            }
        })

        // Compile a piece of HTML containing the component
        var element = $compile("<info-banner></info-banner>")($scope);
        $scope.$digest();
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain("This discount is ending in 3 days or less and cannot be edited. Any changes made to this discount will not be saved.");

    });

});
