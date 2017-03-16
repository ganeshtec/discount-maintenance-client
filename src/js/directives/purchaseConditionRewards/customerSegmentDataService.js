/**
 * Customer Segment Data Service to call the API
 */
app.service('customerSegmentDataService', ['$http', '$q', 'dataService',
    function ($http, $q, dataService) {
        var publicApi = {};

        /*Customer Segment - START*/

        publicApi.getAllSegments = function () {

            var config = {
                    method: 'GET',
                    url: '/customersegment/segments',
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
        /*Customer Segment - END*/

        return publicApi;
    }
]);
