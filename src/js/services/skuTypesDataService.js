/* eslint-disable no-unused-vars */
app.service('skuTypesDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};
        var skuTypes;
        publicApi.fetchSkuTypes = function (data) {
            var config = {
                    method: 'GET',
                    url: '/skutypes/',
                },
                result = $q.defer();
            if (skuTypes != undefined) {
                result.resolve(skuTypes);
            } else {
                dataService.httpRequest(config).then(
                    function (response) {
                        skuTypes = response.data;
                        result.resolve(skuTypes);
                    },
                    function (error) {
                        result.reject(error);
                    });             
            }
            return result.promise;
        }
        return publicApi;
    }
]);
