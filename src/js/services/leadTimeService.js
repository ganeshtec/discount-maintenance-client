/* eslint-disable no-unused-vars */
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

        publicApi.fetchLabelToggle = function (data) {
            
                        var config = {
                                method: 'GET',
                                url: '/labels/showLabelSection',
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
