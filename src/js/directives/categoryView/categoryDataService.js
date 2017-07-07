/* 
	Data Service 
	Services that will handle data http request to web services
*/

app.service('categoryDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getCategories = function (data) {
            var config = {
                method: 'GET',
                url: '/webhierarchy/search?term=' + data + '&type=category'
            }
            var  result = $q.defer();

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
        return publicApi;
    }
]);
