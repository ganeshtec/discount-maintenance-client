app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {
            "dashboardUiUrl": "https://discount-engine.apps-zb.homedepot.com",
            "serviceUrl": "https://promotionsws-ext.apps-zb.homedepot.com/v1",
            "authorizeUrl" : "https://promotionsws-ext.apps-zb.homedepot.com/v1/authorization/isAuthorized/",
            "endecaUrl": "https://origin-thdws.gcp-prod.homedepot.com/TA2/facet"
        };
        return data;
    };
    return _construct;
}]);
