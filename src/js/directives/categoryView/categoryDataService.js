/* 
	Data Service 
	Services that will handle data http request to web services
*/

app.service('categoryDataService', ['$http', '$q', 'dataService', 'DataFactory','URL_CONFIG',
	function($http, $q, dataService, DataFactory,URL_CONFIG){
	var publicApi = {};
    var urls = new URL_CONFIG();



	publicApi.getCategories = function(data){
		console.log('getCategories ', data);
		result = $q.defer();
        
		var url = urls.endecaUrl+'?term='+ data +'&type=category&callback=JSON_CALLBACK';

		$http.jsonp(url)
		    .success(function (data){
		        console.log(data.results);
		        result.resolve(data.results);
		 });
		return result.promise;
	}


		publicApi.getCategoriesSearch = function (data) {
			console.log('getCategoriesSearch ', data);

			var config = {
				method: 'GET',
				url: '/webhierarchy/search?node='+data
				
			},
				result = $q.defer();
			
					dataService.httpRequest(config).then(
				function (response) {
					
					console.log("getCategoriesSearch ==> " , response);
					result.resolve(response);
				}, function (error) {
					console.log(error);
					result.reject(error);
				}
			);
      
			
			return result.promise;
		}


	return publicApi;
}]);