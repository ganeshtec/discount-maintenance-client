/* eslint-disable no-unused-vars */

app.service('constantsConfigService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getConstantsFromConfig = function (data) {

            var config = {
                    method: 'GET',
                    url: '/constants-config',
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
