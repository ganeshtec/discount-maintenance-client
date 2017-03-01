// Mock data for item level percent off promotion
app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {

            "dashboardUiUrl": "https://promotionsadmin.apps-zb.homedepot.com",
            "serviceUrl": "https://promotionsws.apps-zb.homedepot.com/v1",
            "authorizeUrl" : "https://promotionsws.apps-zb.homedepot.com/v1/authorization/isAuthorized/",
            "endecaUrl": "https://origin-thdws.gcp-prod.homedepot.com/TA2/facet"

        };
        return data;
    };
    return _construct;
}]);
