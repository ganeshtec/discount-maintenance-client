app.factory('URL_CONFIG', [function(){    
    var _construct = function URL_CONFIG(){
        var data = {
            'dashboardUiUrl' :'',
            'serviceUrl' : ''
        };
        return data;
    };
    return _construct;
}]);
