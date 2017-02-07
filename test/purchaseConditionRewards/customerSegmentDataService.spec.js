describe('checking Customer Segment Data Service for 200 response code', function(){
	
	var 
    $rootScope,
    $scope,t 
    location,
    $httpBackend;
	

	  it('Test a Data Service call ', inject(function($httpBackend,$http) {
	 
	       var url = "http://promotionsadminsku.apps-np.homedepot.com/v1/customersegment/segments";
	      
     		$httpBackend.when('POST', url, function()
				             {
				        	return true;
				       	}).respond(200, true);
	      			
	      		}));
	
});
