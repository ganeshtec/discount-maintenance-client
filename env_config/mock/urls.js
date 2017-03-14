
// Mock data for item level percent off promotion
app.factory('URL_CONFIG', [function(){    
    var _construct = function URL_CONFIG(){
        var data = {
        "dashboardUiUrl" :"http://localhost:8080",
        "service-url" :"http://localhost:8005"
        };
        return data;
    };
    return _construct;
}]);