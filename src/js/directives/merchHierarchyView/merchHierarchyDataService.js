/**
 * 
 */
app.service('merchHierarchyDataService', ['$http', '$q', 'dataService', 'DataFactory', 'URL_CONFIG',
    function ($http, $q, dataService, DataFactory, URL_CONFIG) {
        var publicApi = {};
        var resourceUrl = '';

        /*Departments - START*/

        publicApi.getAllDepartments = function () {
            var config = {
                    method: 'GET',
                    url: '/merchHierarchy/departments',

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
        /*Departments - END*/

        /*Classes - START*/
        publicApi.getAllClasses = function (dept) {
            var config = {
                method: 'GET',
                url: '/merchHierarchy/classes/' + dept,
            }
            var result = $q.defer();

            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                },
                function (error) {
                    result.reject(error);
                });

            return result.promise
        }
        /*Classes - END*/


        /*Subclasses - START*/
        publicApi.getSubClasses = function (deptId, ClassId) {
            var config = {
                method: 'GET',
                url: '/merchHierarchy/subclasses/' + deptId + '/' + ClassId,
            }
            var result = $q.defer();
            dataService.httpRequest(config).then(
                function (response) {
                    result.resolve(response.data);
                },
                function (error) {
                    result.reject(error);
                });
            return result.promise
        }
        /*Subclasses - END*/
        return publicApi;
    }
]);
