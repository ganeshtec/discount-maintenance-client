describe('DashboardCtrl', function () {
    beforeEach(module('app'));

    var $controller;
    var $scope = {};
    var controller;
    var promotionDataService;
    var $q;
    var $cookies;
    var $location;

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _promotionDataService_, _$q_, _$cookies_, _$location_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        promotionDataService = _promotionDataService_;
        $q = _$q_;
        $location = _$location_;
        $cookies = _$cookies_;
        $cookies.put('currentUserRole', 229);
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
            expect($scope.channelId).toEqual(57);
        });
        it('MFA user should only see promotions created with channel 87', function () {
            $cookies.put('currentUserRole', 228);
            $controller('DashboardCtrl', { $scope: $scope });
            expect($scope.channelId).toEqual(87);
        });
    });
    describe('Discount Search', function () {
        it('Dashboard search method called with channels and searchType', function () {
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
            //$scope.search([57], '', 1, 10, 'all', 'all', 'none', 'asc');
            expect(promotionDataService.getPromotions.calls.count()).toEqual(1);
            expect(promotionDataService.getPromotions.calls.first().args).toEqual([[57], '', 0, 10, 'all', 'all', 'none', 'asc', 'discountName']);
        });

        it('When user does not enter a keyword search should return all records matching other criteria', function () {
            spyOn($location, "search").and.returnValue({ keyword: 'hello', searchType: 'discountName', page: 1, size: 10 });
            $scope.searchTerm = '';
            $scope.updateKeyword();
            expect($location.search.calls.count()).toEqual(2);
            expect($location.search.calls.first().args.length).toEqual(0);
            expect($location.search.calls.mostRecent().args[0].keyword).toEqual('');
        });
        it('When search type changes keyword field should be reset and page should be refreshed', function () {
            spyOn($location, "search").and.returnValue({ keyword: 'hello', searchType: 'discountName', page: 1, size: 10 });
            $scope.searchTerm = 'hello';
            $scope.searchTypeChanged();
            expect($scope.searchTerm).toEqual('');
            expect($location.search.calls.count()).toEqual(2);
            expect($location.search.calls.first().args.length).toEqual(0);
            expect($location.search.calls.mostRecent().args[0].keyword).toEqual('');
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
            console.log("Actual Results:: "+ actualResults.keyword);
            expect(actualResults.keyword).toEqual(expectedResults.keyword);
            expect(actualResults.searchType).toEqual(expectedResults.searchType);
        });
       
    });



});