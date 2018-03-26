describe('DashboardCtrl', function () {
    beforeEach(module('app'));

    var $controller;
    var $scope = {};
    var controller;
    var promotionDataService;
    var $q;
    var $location;

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _promotionDataService_, _$q_, _$location_, _loginService_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        promotionDataService = _promotionDataService_;
        loginService = _loginService_
        $q = _$q_;
        $location = _$location_;
        controller = $controller('DashboardCtrl', { $scope: $scope });
    }));

    describe('Deactivate', function () {
        it('determines if the promotion is within lead time', function () {
            expect($scope.isInLeadTime(new Date(), 5)).toEqual(true);

            var futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);

            expect($scope.isInLeadTime(futureDate, 5)).toEqual(false);
        });

        it('Determines if lead time must be accounted for in this promo', function () {
            expect($scope.eligibleLabelForDeactivate(false, 42, true)).toEqual(false);
            expect($scope.eligibleLabelForDeactivate(true, 61, false)).toEqual(true);
            expect($scope.eligibleLabelForDeactivate(true, 61, true)).toEqual(false);
        });

        it('Determines no action can be taken on MSB with label if within lead time', function () {
            expect($scope.cannotBeDeactivated(true, 61, true)).toEqual(true);
            expect($scope.cannotBeDeactivated(true, 61, false)).toEqual(false);
            expect($scope.cannotBeDeactivated(true, 52, true)).toEqual(false);
        });

        it('Determines an active discount without a label changes status to inactive', function () {

            expect($scope.activeWithNoLabelDiscount(false, 61)).toEqual(true);
            expect($scope.activeWithNoLabelDiscount(true, 61)).toEqual(false);
            expect($scope.activeWithNoLabelDiscount(true, 10)).toEqual(false);
        }
        );

        it('Determines an pending discount will change the status to inactive', function () {

            expect($scope.isPromoStatusPending(57)).toEqual(true);
            expect($scope.isPromoStatusPending(10)).toEqual(false);
        }
        );

    });

    describe('Verify channel initialization based on user roles', function () {
        it('DCM user should only see promotions created with channel 57', function () {
          var currentUserRole = 229;
          spyOn(loginService, 'getCurrentUserRole').and.callFake(function () {
              return currentUserRole;
          })
            $controller('DashboardCtrl', { $scope: $scope });
            expect($scope.channelId).toEqual(57);
        });
        it('MFA user should only see promotions created with channel 87', function () {
          var currentUserRole = 228;
          spyOn(loginService, 'getCurrentUserRole').and.callFake(function () {
              return currentUserRole;
          })
            $controller('DashboardCtrl', { $scope: $scope });
            expect($scope.channelId).toEqual(87);
        });
    });

    describe('Discount Search', function () {
        it('Dashboard search method called with channels and searchType', function () {
          var currentUserRole = 229;
          spyOn(loginService, 'getCurrentUserRole').and.callFake(function () {
              return currentUserRole;
          })
            $controller('DashboardCtrl', { $scope: $scope });
            var deferredResult = $q.defer();
            deferredResult.resolve(
                {
                    criteria: {
                        channels: [57],
                        searchType: 'discountName',
                        term: "",
                        promoSubTypeCd: null,
                        status: null,
                        page: {
                            page: 0,
                            size: 10
                        },
                        sort: null
                    }
                    , totalCount: 1,
                    results: [
                        {
                            promoId: 17567,
                            startDt: "2017-07-14 03:00:0",
                            endDt: "2017-07-15 02:59:59"
                        }
                    ]
                }
            );
            spyOn(promotionDataService, "getPromotions").and.returnValue(deferredResult.promise);
            $scope.searchWithUrlParams();
            expect(promotionDataService.getPromotions.calls.count()).toEqual(1);
            expect(promotionDataService.getPromotions.calls.first().args).toEqual([[57], '', 0, 10, 'all', 'all', 'none', 'asc', 'discountName']);
        });

        it("Should pass the SKU number into the URL as a query parameter when the user searches by SKU", function(){
            var expectedResults = {
                channels: [87],
                keyword: "100090",
                searchType: "sku",
                page: 1,
                type: "all",
                status: "all"
            };
            $scope.searchTerm = "100090";
            $scope.searchType = "sku";
            $scope.updateKeyword();
            var actualResults = $location.search();
            expect(actualResults.keyword).toEqual(expectedResults.keyword);
            expect(actualResults.searchType).toEqual(expectedResults.searchType);
        });

        it('When user does not enter a keyword search should return all records matching other criteria', function () {
            spyOn($location, "search").and.returnValue({ keyword: 'hello', searchType: 'discountName', page: 1, size: 10 });
            $scope.searchTerm = '';
            $scope.updateKeyword();
            expect($location.search.calls.count()).toEqual(2);
            expect($location.search.calls.first().args.length).toEqual(0);
            expect($location.search.calls.mostRecent().args[0].keyword).toEqual('');
        });

        it('When search type changes keyword field should be reset', function () {
            spyOn($location, "search").and.returnValue({ keyword: 'hello', searchType: 'discountName', page: 1, size: 10 });
            $scope.searchTerm = 'hello';
            $scope.searchTypeChanged();
            expect($scope.searchTerm).toEqual('');
        });

        it("Should pass the OMS number into the URL as a query parameter when the user searches by OMS Id", function () {
            var expectedResults = {
                channels: [57],
                keyword: "100634576",
                searchType: "omsId",
                page: 1,
                type: "all",
                status: "all"
            };
            $scope.searchTerm = "100634576";
            $scope.searchType = "omsId";
            $scope.updateKeyword();
            var actualResults = $location.search();
            // console.log("Actual Results:: "+ actualResults.keyword);
            expect(actualResults.keyword).toEqual(expectedResults.keyword);
            expect(actualResults.searchType).toEqual(expectedResults.searchType);
        });

        it("clearSearch should set appropriate default location search parameters", function () {
            var expectedResults = {
                channels: [57],
                keyword: "100634576",
                searchType: "omsId",
                page: 1,
                type: "all",
                status: "all"
            };

            $location.search(expectedResults)

            $scope.clearSearch();

            expect($location.search().keyword).toEqual('');
            expect($location.search().searchType).toEqual('discountName');
            expect($location.search().page).toEqual(1);
            expect($location.search().size).toEqual(10);
        });

    });
});
