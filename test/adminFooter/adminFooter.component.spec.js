describe('Unit testing adminFooter.component.spec.js', function () {
    var $compile,
        $rootScope,
        $scope,
        element,
        utilService,
        $componentController,
        modalService;
    var app = module('app');
    // Load the myApp module, which contains the directive
    beforeEach(app);
    beforeEach(function () {
        module('app', function ($provide) {
            $provide.constant('sectionsIndex', {
                DISCOUNT_PROPERTIES: 0,
                QUALIFIERS: 1,
                LOCATION: 2,
                REWARDS: 3,
                DESCRIPTIONS: 4,
                REDEMPTION_LIMITS: 5,
                LABELS: 6,
                SCHEDULE: 7
            });
            $provide.constant('MaxCouponGenerationLimit', 300000);
        });
    });
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _promotionDataService_, _utilService_, _$componentController_, _modalService_, sectionsIndex) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        promotionDataService = _promotionDataService_;
        utilService = _utilService_;
        $componentController = _$componentController_;
        modalService = _modalService_;
        // ctrl = $componentController('adminFooter',null, {
        //      data: {}

        //      });
        spyOn(utilService, 'getLeadTime').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(3)
                }
            }
        })

        spyOn(promotionDataService, 'saveAsDraft').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })
    }));

    it('Checks if content renders.', function () {
        spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(false)
                }
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
                then: function (callback) {
                    return callback(false)
                }
            }
        })
        spyOn(utilService, 'canApprove').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })
        ctrl = $componentController('adminFooter', null, {
            data: {}

        });
        expect(ctrl.canApprove({})).toEqual(false);

    })

    it('Checks if can approve returns false if promotion is within Lead time', function () {
        spyOn(utilService, 'canApprove').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })
        ctrl = $componentController('adminFooter', null, {
            data: {}

        });
        $scope.$digest();
        expect(ctrl.canApprove({})).toEqual(false);
    })

    it('Checks if can disableClick returns false if promotion status is active and printLabel is On', function () {
        spyOn(utilService, 'canApprove').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        spyOn(utilService, 'isPreviewSubmitClickDisabled').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })


        spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        ctrl = $componentController('adminFooter', null, {
            data: {}

        });
        $scope.$digest();
        expect(ctrl.previewSummary(ctrl.data)).toEqual(false);
    })


    it('Checks if can disableClick returns true if promotion status is active and printLabel is Off', function () {
        spyOn(utilService, 'canApprove').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })


        spyOn(utilService, 'isPreviewSubmitClickDisabled').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        ctrl = $componentController('adminFooter', null, {
            data: {}

        });
        $scope.$digest();
        expect(ctrl.previewSummary()).toEqual(false);
    })

    it('check if save draft modal gets invocked if required fields are missing', function () {

        spyOn(utilService, "requiredFieldsMissing").and.returnValue(true);
        spyOn(utilService, "invalidSysGenCode").and.returnValue(false);
        spyOn(utilService, "setDefaultsForSaveAsDraft").and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })
        spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        spyOn(modalService, 'showAlert');

        spyOn(utilService, 'transformPromotionRequest').and.callFake(function () {
            return {
                then: function (callback) {
                    return callback(true)
                }
            }
        })

        ctrl = $componentController('adminFooter', null, {
            data: {}
        });

        $scope.$digest();
        ctrl.saveDraft(ctrl.data);

        expect(utilService.requiredFieldsMissing).toHaveBeenCalled();
        expect(utilService.invalidSysGenCode).toHaveBeenCalledTimes(0);
        expect(modalService.showAlert).toHaveBeenCalledTimes(1);

    })

});
