/* Unit test for promotion filter in dashboard  */

describe('Promotion filter', function() {
    
    var controller,location,$scope;
    
    beforeEach(module('app'));
    
    beforeEach(inject(function($rootScope, $controller, $filter,
            DataFactory, promotionDataService, $location, $routeParams,
            $mdDialog, dashboardDataService,OverlayConfigFactory) {
        
        $rootScope = $rootScope;
        $scope = $rootScope.$new();
        location=$location;
                
        controller = $controller('DashboardCtrl', {
                $filter:$filter,
                $scope: $scope,
                DataFactory:DataFactory,
                promotionDataService:promotionDataService, 
                $location:$location,
                $routeParams:$routeParams,
                $mdDialog:$mdDialog, 
                dashboardDataService:dashboardDataService, 
                OverlayConfigFactory:OverlayConfigFactory
              });          
        
      }));
    
    it('filter by promotion status', function() {   
        $scope.filtertype = "31"; //Amount off an order
        $scope.filterstatus = "41" //Approved
        spyOn(location, 'search').and.returnValue({ 'couponId':11992,'endDt':'2016-09-16 00:00:00',
                'exclsve':'0',
                'expireDtExtDays':'0',
                'isSitewideDeal':'false',
                'longDesc':'long',
                'name':'BXK8390',
                'promoId':'13293',
                'promoPgmId':'0',
                'promoSubTypeCd':'OrderLevelValueDiscount',
                'promoSubTypeDesc':'Amount off an order - OrderLevelValueDiscount',
                'promoType':'ORDERPROMO' })
        
        $scope.filter(true);

        expect(location.search).toHaveBeenCalled();
        expect(location.search().couponId).toEqual(11992);
        expect(location.search().promoSubTypeCd).toEqual('OrderLevelValueDiscount');
        expect(location.search().name).toEqual('BXK8390');
        
    });
});