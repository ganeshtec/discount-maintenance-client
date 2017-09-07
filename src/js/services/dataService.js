/* 
	Data Service 
	Services that will handle data http request
*/

app.service('dataService', ['$http', '$rootScope', '$q', '$cookies', 'URL_CONFIG', function ($http, $rootScope, $q, $cookies, URL_CONFIG) {
    var publicApi = {};
    var urls = new URL_CONFIG();
    publicApi.httpRequest = function (config) {
        var deferred = $q.defer();
        var serviceUrl = config.service === 'endeca' ? urls.endecaUrl : urls.serviceUrl;

        $http({
            method: config.method,
            url: serviceUrl + config.url,
            data: config.data || {},
            params: config.params || {},
            cache: false,
            withCredentials: true,
            headers: config.headers || {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-THDSSO' : $cookies.get('THDSSO')
                
            }

        }).then(
            function (response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('Error Fetching Data');
                }
            },
            function (error) {
                if(error!=null && error.status == 403){
                    $rootScope.$broadcast('unauth-error');
                }else{
                    deferred.reject(error);
                }
            });

        return deferred.promise;
    }

    return publicApi;

}]);
