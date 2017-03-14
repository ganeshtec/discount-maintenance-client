/* 
	Data Service 
	Services that will handle data http request to web services
*/

app.service('itemsDataService', ['$http', '$q', 'dataService', 'DataFactory',
    function ($http, $q, dataService, DataFactory) {
        var publicApi = {};

        publicApi.getOmsIdCodes = function (data) {
            var config = {
                    method: 'POST',
                    url: '/omsInfo/validate.json',
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

        publicApi.getOmsIDs = function (data) {
            var omsIDs = [];
            for (var i = 0; i < data.length; i++) {
                omsIDs.push(parseInt(data[i]));
            }
            return omsIDs;
        };

        publicApi.getSkuIdCodes = function (data) {


            var config = {
                    method: 'POST',
                    url: '/skuInfo/skus/validate.json',
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

        publicApi.getSkuIDs = function (data) {
            var skuIDs = [];
            for (var i = 0; i < data.length; i++) {
                skuIDs.push(parseInt(data[i]));
            }
            return skuIDs;
        };


        return publicApi;
    }
]);
