app.factory('URL_CONFIG', [function(){    
    var _construct = function URL_CONFIG(){
        var data = {
            'dashboardUiUrl': 'https://promotionsadmin-ad.apps-np.homedepot.com',
            'serviceUrl' : 'https://promotionsws-ext-ad.apps-np.homedepot.com/v1',
            // 'serviceUrl' : 'http://localhost.homedepot.com:8090/v1',
            'authorizeUrl': 'https://promotionsws-ext-ad.apps-np.homedepot.com/v1/authorization/isAuthorized/',
        };
        return data;
    };
    return _construct;
}]);
