describe('Unit testing adminFooter.directive.spec.js', function () {
  var $compile,
    $rootScope,
    $scope,
    element,
    utilService,
    $componentController;
  var app = module('app');
  // Load the myApp module, which contains the directive
  beforeEach(app);
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_, _promotionDataService_, _utilService_, _$componentController_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    promotionDataService = _promotionDataService_;
    utilService = _utilService_;
    $componentController = _$componentController_;
    // ctrl = $componentController('adminFooter',null, {
    //      data: {} 
         
    //      });
    spyOn(utilService, 'getLeadTime').and.callFake(function () {
      return {
        then: function (callback) { return callback(3) }
      }
    })  
    // this.$isolateScope = element.isolateScope();


  }));

  it('Checks if content renders.', function () {
    spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
        return {
          then: function (callback) { return callback(false) }
        }
      })

    $scope.promotionData = {}
    // Compile a piece of HTML containing the directive
    element = $compile("<admin-footer data='promotionData'></admin-footer>")($scope);
    $scope.$digest();

    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Preview");
    expect(element.html()).toContain("Save as Draft");
    expect(element.html()).toContain("Submit");
  });


  it('Checks if can approve returns true if promotion is not within Lead time', function () {

     spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
        return {
          then: function (callback) { return callback(false) }
        }
      })
    spyOn(utilService, 'canApprove').and.callFake(function () {
      return {
        then: function (callback) { return callback(true) }
      }
    })
    ctrl = $componentController('adminFooter',null, {
         data: {} 
         
         });
    expect(ctrl.canApprove({})).toEqual(true);

  })

  it('Checks if can approve returns false if promotion is within Lead time', function () {
      spyOn(utilService, 'canApprove').and.callFake(function () {
        return {
          then: function (callback) { return callback(true) }
        }
      })

    spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
        return {
          then: function (callback) { return callback(true) }
        }
      })
    ctrl = $componentController('adminFooter',null, {
         data: {} 
         
         });
    $scope.$digest();
    expect(ctrl.canApprove({})).toEqual(false);
  })

  it('Checks if can approve returns true if promotion status is not active', function () {
      spyOn(utilService, 'canApprove').and.callFake(function () {
        return {
          then: function (callback) { return callback(true) }
        }
      })

    spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
        return {
          then: function (callback) { return callback(false) }
        }
      })

      spyOn(utilService, 'isPromotionActive').and.callFake(function () {
        return {
          then: function (callback) { return callback(false) }
        }
      }) 

    ctrl = $componentController('adminFooter',null, {
         data: {} 
         
         });
    $scope.$digest();
    expect(ctrl.canApprove({})).toEqual(true);
  })

   it('Checks if can approve returns false if promotion status is active', function () {
      spyOn(utilService, 'canApprove').and.callFake(function () {
        return {
          then: function (callback) { return callback(false) }
        }
      })

    spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
        return {
          then: function (callback) { return callback(true) }
        }
      })

      spyOn(utilService, 'isPromotionActive').and.callFake(function () {
        return {
          then: function (callback) { return callback(true) }
        }
      }) 

    ctrl = $componentController('adminFooter',null, {
         data: {} 
         
         });
    $scope.$digest();
    expect(ctrl.canApprove({})).toEqual(false);
  })

});