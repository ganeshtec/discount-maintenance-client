app.factory('URL_CONFIG', [function(){
    var _construct = function URL_CONFIG(){
        var data = {
            'dashboardUiUrl': 'http://localhost.homedepot.com:8002',
            //'serviceUrl' : 'https://promotionsws-ext-ad.apps-np.homedepot.com/v1',
            'serviceUrl' : 'http://localhost.homedepot.com:8080/v1',
            'authorizeUrl': 'https://promotionsws-ext-ad.apps-np.homedepot.com/v1/authorization/isAuthorized/'
        };
        return data;
    };
    return _construct;
}]);
