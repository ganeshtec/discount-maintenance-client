app.factory('PROMOCODE', [function(){	
	var _construct = function PROMOCODE(){
		var data = {
						"type": "Public", // Private sys gen, Public user gen
						"genType": "user", // user || system generated
						// "systemGen": { // only if syst gen
						// 	"uniqueCdCnt": "1",
						// 	"cdPrefix": "",
						// 	"cdSuffix": ""
						// },
						// "promoCodes": [ ], // only if user
					"cdLength": ""
			};
		return data;
	};
	return _construct;
}]);