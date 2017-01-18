describe('Service: promotionDataService',function(){

   

    var promoservice, httpBackend,response;
    var staticresponse = JSON.stringify({"cdLength":12,"type":null,"genType":null,"systemGen":{"numberOfUniqueCodes":2147483647,"uniqueCdCnt":5,"cdSuffix":"_there","cdPrefix":"hi_"},"promoCodes":["hi_*9W^HI#E0O*C_there","hi_)*_^IX!^PPOB_there","hi_CI*LRFZDB@O-_there","hi_AB@&LOLCAHAV_there","hi_@CQ*Q)+2BL-Y_there"],"exception":null });
    
    // Load the myApp module, which contains the directive
  beforeEach(module('app'));

    beforeEach(inject(function($httpBackend, $rootScope, $controller, _promotionDataService_){
        httpBackend = $httpBackend;
        promoservice = _promotionDataService_ ;

    }));

    it('Return a POST response from a Service function', function() {
        var url = "https://promotionsws-ad.apps-np.homedepot.com/v1/couponRequest/preview";
        var dataObj = JSON.stringify({
            systemGen: {  "uniqueCdCnt":"5",
                            "cdPrefix":"hi_",
                         "cdSuffix":"_there" 
                        },
            cdLength: 12
        });
        httpBackend.expect('POST', url , dataObj)
            .respond({
                 "cdLength":12,"type":null,"genType":null,"systemGen":{"numberOfUniqueCodes":2147483647,"uniqueCdCnt":5,"cdSuffix":"_there","cdPrefix":"hi_"},"promoCodes":["hi_*9W^HI#E0O*C_there","hi_)*_^IX!^PPOB_there","hi_CI*LRFZDB@O-_there","hi_AB@&LOLCAHAV_there","hi_@CQ*Q)+2BL-Y_there"],"exception":null
            });

        promoservice.getSystemGenrateCodes(dataObj).success(function(response) {
            console.log(response);
                response = response;
            
        });

        httpBackend.flush();

        expect(response).toBe(staticresponse);
    });
});