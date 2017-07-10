app.service('locationDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getStoreIdCodes = function (data) {
            
            var config = {
                    method: 'POST',
                    url: '/location/store/validate.json',
                    data: {locationNumbers: publicApi.getStoreIds(data.locationNumbers)}
                },
                result = $q.defer();
            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                    
                },
                function (error) {
                    result.reject(error);
                }
            );
            return result.promise;
        }

        publicApi.validateMarketIds = function (data) {
  
            var config = {
                    method: 'POST',
                    url: '/location/market/validate.json',
                    data: data
                },
                result = $q.defer();
            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                    
                },
                function (error) {
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
        }
        return publicApi;
    }
]);
