describe('DashboardCtrl', function () {
    beforeEach(module('app'));

    var $controller;
    var $scope = {};
    var controller;
    var promotionDataService;
    var $q;
    var $cookies;

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _promotionDataService_,_$q_,_$cookies_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        promotionDataService = _promotionDataService_;
        $q=_$q_;
        $cookies=_$cookies_;
        $cookies.put('currentUserRole',229);
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
    });


    describe('Verify channel initialization based on user roles', function(){
        it('DCM user should only see promotions created with channel 57', function(){
            expect($scope.channelId).toEqual(57);          
        });
        it('MFA user should only see promotions created with channel 87', function(){
            $cookies.put('currentUserRole',228);
            $controller('DashboardCtrl', { $scope: $scope });
            expect($scope.channelId).toEqual(87); 
        });
    });
    describe('DiscountsSearchBasedOnChannels', function () {
        it('Dashboard search method called with channels', function () {
            var deferredResult = $q.defer();
            deferredResult.resolve(
                {criteria: {
        		    channels: [57],
        		    term: "",
        		    promoSubTypeCd: null,
        		    status: null,
        		    page: {
        			    page: 0,
        			    size: 10
        		    },
        		    sort: null
                }
                , totalCount:1, 
                results:[
                    {
       		            promoId: 17567,
                        startDt: "2017-07-14 03:00:0", 
        		        endDt: "2017-07-15 02:59:59"
                    }
                ]}
            );
            spyOn(promotionDataService, "getPromotions").and.returnValue(deferredResult.promise);
            $scope.searchWithUrlParams();
            //$scope.search([57], '', 1, 10, 'all', 'all', 'none', 'asc');
            expect(promotionDataService.getPromotions.calls.count()).toEqual(1);
            console.log(promotionDataService.getPromotions.calls.first().args);
            expect(promotionDataService.getPromotions.calls.first().args).toEqual([[57],'',0,10,'all','all','none','asc']);
            
        });


    });


});