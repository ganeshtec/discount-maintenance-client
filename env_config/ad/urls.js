// Mock data for item level percent off promotion
app.factory('URL_CONFIG', [function() {
    var _construct = function URL_CONFIG() {
        var data = {
            "dashboardUiUrl": "http://localhost.homedepot.com",
            //"serviceUrl": "https://promotionsws-qa.apps-np.homedepot.com/v1",
            //"serviceUrl": "https://promotionswssku-qa.apps-np.homedepot.com/v1",
            "serviceUrl": "http://http://localhost.homedepot.com:8090/v1",
            "authorizeUrl": "http://localhost.homedepot.com:8090/v1/authorization/isAuthorized/"
           //"authorizeUrl" : "https://promotionsws-qa.apps-np.homedepot.com/v1/authorization/isAuthorized.json?userid=",
            "endecaUrl": "https://origin-thdws.gcp-stage.homedepot.com/TA2/facet"
        };
        return data;
    };
    return _construct;
}]);