app.service('leadTimeService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.fetchLeadTime = function (data) {

            var config = {
                    method: 'GET',
                    url: '/labels/leadTime',
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
