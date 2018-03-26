app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {
            'dashboardUiUrl': 'https://discount-admin-client.apps.homedepot.com',
            'serviceUrl': 'https://promotionsws-ext.apps-zb.homedepot.com/v1',
            'authorizeUrl' : 'https://promotionsws-ext.apps-zb.homedepot.com/v1/authorization/isAuthorized/',
        };
        return data;
    };
    return _construct;
}]);
