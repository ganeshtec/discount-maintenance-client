app.service('locationDataService', ['$http', '$q', 'dataService', 'DataFactory',
	function ($http, $q, dataService, DataFactory) {
		var publicApi = {};

		publicApi.getStoreIdCodes = function (data) {
			console.log('getStoreIdCodes ', data);

			var config = {
				method: 'POST',
				url: '/store/validate.json',
				data: data
			},
				result = $q.defer();
			dataService.httpRequest(config).then(
				function (response) {
					console.log(response.data);
					result.resolve(response.data);
				}, function (error) {
					console.log(error);
					result.reject(error);
				}
			);
			return result.promise;
		}

		publicApi.getStoreIds = function (data) {
			var storeIDs = [];
			for (var i = 0; i < data.length; i++) {
				storeIDs.push(parseInt(data[i]));
			}
			return storeIDs;
		};


		return publicApi;
	}]);