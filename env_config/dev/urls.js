// Mock data for item level percent off promotion
app.factory('URL_CONFIG', [function(){	
	var _construct = function URL_CONFIG(){
		var data = {
			"dashboardUiUrl" :"http://localhost.homedepot.com:8080",
			//"serviceUrl" :"http://172.22.41.36:8090/v1",
			//"serviceUrl" :"https://promotionswssku-qa.apps-np.homedepot.com/v1",
			"serviceUrl": "http://localhost:8090/v1",
	    //"authorizeUrl" : "https://promotionsws-qa.apps-np.homedepot.com/v1/authorization/isAuthorized.json?userid=",
	    "authorizeUrl": "http:://localhost:8090/v1/authorization/isAuthorized/"
	    "endecaUrl": "https://origin-thdws.gcp-stage.homedepot.com/TA2/facet"
		};
		return data;
	};
	return _construct;
}]);