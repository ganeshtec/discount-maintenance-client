app.factory('PROMOCODE', [function(){	
	var _construct = function PROMOCODE(){
		var data = {
						"type": "Public", // Private sys gen, Public user gen
						"genType": "user", // user || system generated
					"cdLength": ""
			};
		return data;
	};
	return _construct;
}]);