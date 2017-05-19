describe('utilService', function () {
  var $httpBackend,
    $compile,
    $rootScope,
    $scope,
    utilService,
    leadTimeService;



  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_, _utilService_, _leadTimeService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    utilService = _utilService_;
    leadTimeService = _leadTimeService_;

    spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function () {
      return {
        then: function (callback) { return callback(3) }
      }
    })

  }));
  it('get lead time', function () {
    var leadResponsePromise = utilService.getLeadTime();
    var leadTime = 0;
    leadResponsePromise.then(function (value) {
      leadTime = value;
    })
    expect(leadTime).toBe(3);
  });

  it('isSubmitEligibleForDisable should return true for active promotion with printlabel and endDt within lead time', function () {

    var promotion = {
      "endDt": moment().add(1, 'days').toDate(),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(true);
  });

  it('isSubmitEligibleForDisable should return false for active promotion with printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').toDate(),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);

  });

  it('isSubmitEligibleForDisable should return false for active promotion without printlabel and endDt within lead time', function () {
    var promotion = {
      "endDt": moment().add(1, 'days').format("YYYY-MM-DD"),
      "printLabel": false,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });

  it('isSubmitEligibleForDisable should return false for active promotion without printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').format("YYYY-MM-DD"),
      "printLabel": false,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });


  it('isSubmitEligibleForDisable should return false for inactive promotion with printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 20
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });

  it('isSubmitEligibleForDisable should return true for active promotion with printlabel and endDt minus lead time is equal to today', function () {
    var promotion = {
      "endDt": moment().add(3, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(true);

  });

  it('isSubmitEligibleForDisable should return false for active promotion with printlabel and today is one day more than end date minus lead time', function () {
    var promotion = {
      "endDt": moment().add(4, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 61
    }
    
    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);

  });


});
