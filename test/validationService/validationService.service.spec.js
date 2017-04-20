fdescribe('validationService', function () {
    var $compile,
        $rootScope,
        $scope,
        $filter,
        validationService;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _validationService_, _$filter_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        validationService = _validationService_;
        $filter = _$filter_;

    }));

    it('Returns a startDt errors object with isError and message properties', function () {
       
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var response = validationService.validateStartDate(today);
        expect(response.isError).toBeDefined();
        expect(response.message).toBeDefined();
    });

    it('Returns isError as true and non empty error message when selected start date is in the past', function () {
        var pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        pastDate = $filter('date')(pastDate, 'yyyy-MM-dd');
        
        var response = validationService.validateStartDate(pastDate);
        expect(response.isError).toBe(true);
        expect(response.message).not.toBe('');
    })

    it('Returns isError as false and empty error message when selected start date is in the future', function () {
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        futureDate = $filter('date')(futureDate, 'yyyy-MM-dd');
        var response = validationService.validateStartDate(futureDate);
        expect(response.isError).toBe(false);
        expect(response.message).toBe('');
    })

    it('Returns isError as false and empty error message when selected start date is today', function () {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var response = validationService.validateStartDate(today);
        expect(response.isError).toBe(false);
        expect(response.message).toBe('');
    })

    it('Returns isError as true and non empty error message when selected End date is in the past', function () {
        var pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        pastDate = $filter('date')(pastDate, 'yyyy-MM-dd');
        
        var response = validationService.validateEndDate(pastDate);
        expect(response.isError).toBe(true);
        expect(response.message).not.toBe('');
    })

    it('Returns isError as false and empty error message when selected End date is in the future', function () {
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        futureDate = $filter('date')(futureDate, 'yyyy-MM-dd');
        var response = validationService.validateEndDate(futureDate);
        expect(response.isError).toBe(false);
        expect(response.message).toBe('');
    })

    it('Returns isError as false and empty error message when selected End date is today', function () {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var response = validationService.validateEndDate(today);
        expect(response.isError).toBe(false);
        expect(response.message).toBe('');
    })

});
