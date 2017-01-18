app.factory('itemCategorySourceData', [function(){
	var _construct = function itemCategorySourceData(){
		var data = {
					"inclusions": {
							"partnumbers": [],
							"hierarchies": [],
							"attrs": []
					},
					 "exclusions": {
					 		"partnumbers": [],
							"hierarchies": [],
							"attrs": []
					},
					"minPurchaseQty": null
				};
		return data;
	};
	return _construct;
}]);

