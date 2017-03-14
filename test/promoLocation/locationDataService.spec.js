describe('____checking location data service for 200 response code', function(){
    
    var 
    $rootScope,
    $scope,
    location,
    $httpBackend;

       // Load the myApp module, which contains the directive
  beforeEach(module('app'));
 
     it('Return a get 200 response code  from a Service function ', inject(function($httpBackend) {
         
        var postdata = {
                   "storeNumbers":[8119,121,1111]
                   }
 
        var url = "http://promotionswssku-qa.apps-np.homedepot.com/v1/store/validate.json";
      
              $httpBackend.when('POST', url, function()
                         {
                        return true;
                       }).respond(200, true);
    }));
    
    
});