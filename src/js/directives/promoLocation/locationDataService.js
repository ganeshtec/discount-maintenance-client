app.service('locationDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        publicApi.getStoreIdCodes = function (data) {
            //console.log("getStores dataService is executing..."+JSON.stringify(data));
            var config = {
                    method: 'POST',
                    //url: '/store/validate.json',
                    url: '/location/store/validate.json',
                    
                    data: data
                },
                result = $q.defer();
            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                    // console.log("Store call Response::: "+ JSON.stringify(response.data));
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

        publicApi.getStoresFromMarkets= function (data) {
            //console.log("getStoresFromMarkets is executing..."+JSON.stringify(data));
            var config = {
                    method: 'POST',
                    //url: '/store/validate.json',
                    url: '/location/market/validate.json',
                    
                    data: data
                },
                result = $q.defer();
              
            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                    //console.log("Market Response::: "+ JSON.stringify(response.data));
                },
                function (error) {
                    result.reject(error);
                });

            return result.promise;


        };



        return publicApi;
    }
]);
