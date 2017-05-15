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

    it('returns a startDt errors object with isError and message properties.', function () {
        var today = moment();

        validationService.validateStartDate(today, function(response) {
            expect(response.isError).toBeDefined();
            expect(response.message).toBeDefined();
        });
        
    });

    it('returns a start date error when selected start date is in the past.', function () {
        var pastDate = moment().subtract(3, 'days');
        // pastDate = $filter('date')(pastDate, 'yyyy-MM-dd');

        validationService.validateStartDate(pastDate, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    })

    it('returns a false/empty start date error when selected start date is in the future.', function () {
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        futureDate = $filter('date')(futureDate, 'yyyy-MM-dd');

        validationService.validateStartDate(futureDate, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    })

    it('returns a false/empty start date error when selected start date is today.', function () {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        validationService.validateStartDate(today, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    })

    it('returns an end date error when selected end date is in the past.', function () {
        var pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        pastDate = $filter('date')(pastDate, 'yyyy-MM-dd');
        var startDate = undefined;

        validationService.validateEndDate(undefined, pastDate, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    })

    it('returns a false/empty end date error when selected end date is in the future.', function () {
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        futureDate = $filter('date')(futureDate, 'yyyy-MM-dd');
        validationService.validateEndDate(undefined, futureDate, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });

    })

    it('returns a false/empty end date error when selected end date is today.', function () {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        validationService.validateEndDate(undefined, today, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    });

    it('returns an end date error when an MSB discount\'s end date is earlier than start date plus lead time.', function () {
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

        validationService.validateMSBEndDate(undefined, endDt, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });

    });

    it('returns a false/empty end date error when an MSB discount\'s end date is after start date plus lead time.', function () {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var leadtime = 3;
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + leadtime);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');


        spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function () {
            return {
                then: function (callback) { return callback(3) }
            }
        })

        validationService.validateMSBEndDate(today, endDt, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });

    });

    it('returns a false/empty end date error message when selected end date is after start date.', function () {
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + 5);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');

        var startDt= new Date();
        startDt.setDate(startDt.getDate() + 3);
        startDt = $filter('date')(startDt, 'yyyy-MM-dd');


        validationService.validateEndDate(startDt, endDt, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
        
    });

    it('returns an end date error when selected end date is earlier than start date.', function () {
        var endDt = new Date();
        endDt.setDate(endDt.getDate() + 5);
        endDt = $filter('date')(endDt, 'yyyy-MM-dd');

        var startDt = new Date();
        startDt.setDate(startDt.getDate() + 7);
        startDt = $filter('date')(startDt, 'yyyy-MM-dd');

        validationService.validateEndDate(startDt, endDt, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    });

    it('sets minimum end date to today plus lead time when no start date is selected.', function() {
        var leadTime = 3;
        var today = new Date();
        var expectedMinEndDate = $filter('date')(today.setDate(today.getDate() + leadTime), 'yyyy-MM-dd');

        validationService.getMinEndDate(undefined, leadTime, function(response) {
            expect(response).toEqual(expectedMinEndDate);
        });
    })

    it('sets minimum end date to today plus lead time when a start date is selected.', function() {
        var leadTime = 3;
        var startDate = new Date();
        startDate.setDate(startDate.getDate() + 5);
        var expectedMinEndDate = $filter('date')(new Date().setDate(startDate.getDate() + leadTime), 'yyyy-MM-dd');
        startDate = $filter('date')(startDate, 'yyyy-MM-dd');

        validationService.getMinEndDate(startDate, leadTime, function(response) {
            expect(response).toEqual(expectedMinEndDate);
        });
    })

    it('returns a minimum quantity error when selected minimum quantity threshold is 0.', function () {
        var rewards = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}]

        validationService.validateMinimumQty(rewards, function(response) {
            expect(response[0].isError).toBe(true);
            expect(response[0].message).not.toBe('');
            expect(response[2].isError).toBe(true);
            expect(response[2].message).not.toBe('');
        });
    });

    it('returns a false/empty minimum quantity error when selected minimum quantity threshold is greater than 0.', function () {
        var rewards = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}]

        validationService.validateMinimumQty(rewards, function(response) {
            expect(response[1].isError).toBe(false);
            expect(response[1].message).toBe('');
        });
    });

    it('returns percent off error messages when percent off selections are greater than 100.', function () {
        var rewards = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}]

        validationService.validatePercentOff(rewards, function(response) {
            expect(response[2].isError).toBe(true);
            expect(response[2].message).not.toBe('');
        });
    });

    it('returns false/empty percent off error messages when percent off selections are less than 100.', function () {
        var rewards = [{min:0,value:12,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:120,maxAllowedVal:25}]

        validationService.validatePercentOff(rewards, function(response) {
            expect(response[0].isError).toBe(false);
            expect(response[0].message).toBe('');
            expect(response[1].isError).toBe(false);
            expect(response[1].message).toBe('');
        });
    });

    it('returns percent off error messages when percent off selections are less than 0.01.', function () {
        var rewards = [{min:0,value:-1,maxAllowedVal:2},{min:2,value:25,maxAllowedVal:3},{min:0,value:-150,maxAllowedVal:25}]

        validationService.validatePercentOff(rewards, function(response) {
            expect(response[0].isError).toBe(true);
            expect(response[0].message).not.toBe('');
            expect(response[2].isError).toBe(true);
            expect(response[2].message).not.toBe('');
        });
    });
});
