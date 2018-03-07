describe('checking promo sub types data service for 200 response code', function(){
       // Load the myApp module, which contains the directive
  beforeEach(module('app'));

    beforeEach(inject(function($httpBackend, $rootScope, $controller, _promotionDataService_){
        httpBackend = $httpBackend;
        promoservice = _promotionDataService_ ;

    }));

     it('Return a get 200 response code  from a Service function ', function() {
        var url = "https://promotionsws-ad.apps-np.homedepot.com/v1/promotionTypes/promotionSubTypes/adminUI.json";

        httpBackend.expect('GET', url )
            .respond(200);

    });
});
