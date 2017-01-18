// Mock data for item level percent off promotion
app.factory('SourceData', [function(){	
	var _construct = function SourceData(){
		var data  = {
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