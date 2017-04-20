app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {
            "dashboardUiUrl": "https://promotionsadmin-ad.apps-np.homedepot.com",
            "serviceUrl": "https://promotionsws-ext-ad.apps-np.homedepot.com/v1",
            "authorizeUrl": "https://promotionsws-ext-ad.apps-np.homedepot.com/v1/authorization/isAuthorized/",
            "endecaUrl": "https://origin-thdws.gcp-stage.homedepot.com/TA2/facet"
        };
        return data;
    };
    return _construct;
}]);