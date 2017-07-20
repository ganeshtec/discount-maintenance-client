app.service('locationDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getStoreIdCodes = function (data) {

            var config = {
                    method: 'POST',
                    url: '/location/store/validate.json',
                    data: { locationNumbers: publicApi.parseIds(data.locationNumbers) }
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
                    data: { locationNumbers: publicApi.parseIds(data.locationNumbers) }
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

        publicApi.parseIds = function (data) {
            var locationIDs = [];
            for (var i = 0; i < data.length; i++) {
                locationIDs.push(parseInt(data[i]));
            }
            return locationIDs;
        }
        return publicApi;
    }
]);
