app.service('locationDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getStoreIdCodes = function (data, location) {
  
            var config = {
                    method: 'POST',
                    url: location=='stores'? '/location/store/validate.json':'/location/market/validate.json',
                    data: data
                },
                result = $q.defer();
            dataService.httpRequest(config).then(
                function (response) {
                     //console.log("---Response :",response);
                     //console.log("---Response.data :",response.data);
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
