describe('validationService', function () {
    var $compile,
        $rootScope,
        $scope,
        $filter,
        validationService,
        leadTimeService;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _validationService_, _$filter_, _leadTimeService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        validationService = _validationService_;
        $filter = _$filter_;
        leadTimeService = _leadTimeService_;

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

    it('Returns isError as true and non empty error message when promo is MSB and end date is less than today + lead time', function () {
        var promoSubTypeCd = 'ProductLevelPerItemPercentDiscountMSB';
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var leadtime = 3;
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + leadtime - 1);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');


        spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function () {
            return {
                then: function (callback) { return callback(3) }
            }
        })

        validationService.validateLeadTime(promoSubTypeCd, endDt, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });

    });

    it('Returns isError as false and empty error message when promo is MSB and end date is greater than today + lead time', function () {
        var promoSubTypeCd = 'ProductLevelPerItemPercentDiscountMSB';
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var leadtime = 3;
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + leadtime + 1);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');


        spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function () {
            return {
                then: function (callback) { return callback(3) }
            }
        })

        validationService.validateLeadTime(promoSubTypeCd, endDt, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });

    });

    it('Returns isError as false and empty error message when selected End date is greater than Start date', function () {
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + 5);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');

        var startDt= new Date();
        startDt.setDate(startDt.getDate() + 3);
        startDt = $filter('date')(startDt, 'yyyy-MM-dd');


        var response = validationService.validateEndDtWithStartDt(startDt, endDt);
        expect(response.isError).toBe(false);
        expect(response.message).toBe('');
    });

    it('Returns isError as true and non empty error message when selected End date is less than Start date', function () {
        var endDt= new Date();
        endDt.setDate(endDt.getDate() + 5);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');

        var startDt= new Date();
        startDt.setDate(startDt.getDate() + 7);
        startDt = $filter('date')(startDt, 'yyyy-MM-dd');


        var response = validationService.validateEndDtWithStartDt(startDt, endDt);
        expect(response.isError).toBe(true);
        expect(response.message).not.toBe('');
    });

    fit('Returns isError as true and non empty error message when selected minimum quantity threshold is 0', function () {
        var rewards = [{min:0,max:2},{min:2,max:3},{min:0,max:25}]

        var response = validationService.validateMinimumQty(rewards);
        expect(response[0].isError).toBe(true);
        expect(response[0].message).not.toBe('');
    });

    fit('Returns isError as false and empty error message when selected minimum quantity threshold is other than 0', function () {
        var rewards = [{min:0,max:2},{min:2,max:3},{min:0,max:25}]

        var response = validationService.validateMinimumQty(rewards);
        expect(response[1].isError).toBe(false);
        expect(response[1].message).toBe('');
    });



});
