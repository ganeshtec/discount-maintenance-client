/**
 * Customer Segment Data Service to call the API
 */
app.service('customerSegmentDataService', ['$http', '$q', 'dataService', 'DataFactory','URL_CONFIG',
	function($http, $q, dataService, DataFactory,URL_CONFIG){
	var publicApi = {};
	var resourceUrl =  '';

	/*Customer Segment - START*/
	
	publicApi.getAllSegments = function() {
		console.log('getAll Customer Segments DataService');
		var config= {
				method: 'GET',
				url: '/customersegment/segments',
		},
		result=$q.defer();
		
		dataService.httpRequest(config).then(
				function(response){
					console.log('getCustomerSegments ', response.data);
					result.resolve(response.data);
				},function(error){
					console.log(error);
					result.reject(error);
			});
	
		return result.promise;
	}
	/*Customer Segment - END*/
	
	return publicApi;
}]);