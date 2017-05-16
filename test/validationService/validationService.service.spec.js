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
        var today = moment().toDate();

        validationService.validateStartDate(today, function(response) {
            expect(response.isError).toBeDefined();
            expect(response.message).toBeDefined();
        });
    });

    it('returns a start date error when selected start date is in the past.', function () {
        var pastStartDate = moment().subtract(3, 'days').toDate();

        validationService.validateStartDate(pastStartDate, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    })

    it('returns a false/empty start date error when selected start date is in the future.', function () {
        var futureDate = moment().add(3, 'days').toDate();

        validationService.validateStartDate(futureDate, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    })

    it('returns a false/empty start date error when selected start date is today.', function () {
        var today = moment().toDate();

        validationService.validateStartDate(today, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    })

    it('returns an end date error when selected end date is in the past.', function () {
        var pastDate = moment().subtract(2, 'days').toDate();
        var startDate = undefined;

        validationService.validateEndDate(startDate, pastDate, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    })

    it('returns a false/empty end date error when selected end date is in the future.', function () {
        var futureDate = moment().add(1, 'days').toDate();

        validationService.validateEndDate(undefined, futureDate, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });

    })

    it('returns a false/empty end date error when selected end date is today.', function () {
        var today = moment().toDate();

        validationService.validateEndDate(undefined, today, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
    });

    it('returns an end date error when an MSB discount\'s end date is earlier than start date plus lead time.', function () {
        var leadtime = 3;
        var endDt = moment().add(leadtime - 1, 'days').toDate();


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

    it('returns a false/empty end date error when a MSB discount\'s end date is after start date plus lead time.', function () {
        var today = moment().toDate();
        var leadtime = 3;
        var endDt = moment(today).add(leadtime).toDate();

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
        var endDt = moment().add(5, 'days').toDate();
        var startDt= moment().add(3, 'days').toDate();

        validationService.validateEndDate(startDt, endDt, function(response) {
            expect(response.isError).toBe(false);
            expect(response.message).toBe('');
        });
        
    });

    it('returns an end date error when selected end date is earlier than start date.', function () {
        var endDt = moment().add(5, 'days').toDate();
        var startDt = moment().add(7, 'days').toDate();

        validationService.validateEndDate(startDt, endDt, function(response) {
            expect(response.isError).toBe(true);
            expect(response.message).not.toBe('');
        });
    });

    it('sets minimum end date to today plus lead time when no start date is selected.', function() {
        var leadTime = 3;
        var expectedMinEndDate = moment().add(leadTime, 'days').toDate();

        validationService.getMinEndDate(undefined, leadTime, function(response) {
            expect(response).toEqual(expectedMinEndDate);
        });
    })

    it('sets minimum end date to today plus lead time when a start date is selected.', function() {
        var leadTime = 3;
        var startDate = moment().add(5, 'days').toDate();
        var expectedMinEndDate = moment(startDate).add(leadTime, 'days').toDate();

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
