/* eslint-disable no-unused-vars */
app.service('featureFlagService', ['$http', '$q', 'dataService',
function ($http, $q, dataService) {
    var publicApi = {};

    publicApi.getFeatureFlags = function (data) {
        
        var config = {
                method: 'GET',
                url: '/featureFlags',
            },
            result = $q.defer();

        dataService.httpRequest(config).then(
            function (response) {
                result.resolve(response.data);
            },
            function (error) {
                result.reject(error);
            });

        return result.promise;
    }
    return publicApi;
}
]);
