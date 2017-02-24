// Mock data for item level percent off promotion
app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {
            "dashboardUiUrl": "https://promotionsadmin-qa.apps-np.homedepot.com",
            "serviceUrl": "https://promotionsws-ext-qa.apps-np.homedepot.com/v1",
            "authorizeUrl" : "https://promotionsws-qa.apps-np.homedepot.com/v1/authorization/isAuthorized.json?userid=",
            "endecaUrl": "https://origin-thdws.gcp-stage.homedepot.com/TA2/facet"

        };
        return data;
    };
    return _construct;
}]);