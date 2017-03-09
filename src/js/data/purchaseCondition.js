app.factory('purchaseCondition', [function(){	
	var _construct = function purchaseCondition(){
		var data = {
				"qualUOM": null,
                "min": null,
                "max": -1,
                "maxAllowedVal": null,
                "seq": 0,
                "value": null
        }
		return data;
	};
	return _construct;
}]);