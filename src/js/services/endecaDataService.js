/* 
	Data Service 
	Services that will handle endeca http request to web services
*/
app.service('endecaDataService', ['$http', '$q', 'dataService',
	function($http, $q, dataService){
	var publicApi = {};
	
	// Service to get Sales catalog
	publicApi.getSalesCatalog = function(term){
		var config = {
				method: 'JSONP',
				service: 'endeca',
				url: '?callback=JSON_CALLBACK&type=category&term='+term				
			},
	
		result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				console.log('getSalesCatalog', response.data);
				result.resolve(response.data);
			},function(error){
				console.log(error);
				result.reject(error);
		});
		
		return result.promise;
	}	
	
	return publicApi;
}]);