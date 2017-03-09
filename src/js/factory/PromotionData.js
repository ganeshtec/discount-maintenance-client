// Mock data for item level percent off promotion
app.factory('PromotionData', [function(){	
	var _construct = function PromotionData(){
		var data = {
			"promoId": 0,
			"status": 20, // 20 draft
			"priority": 0,
			"shortDesc": "",
			"longDesc": "",
			"startDt": "",
			"endDt": "",
			"name":"",
			"redmptnLmt": {
			  "maxUsesPerOrd": "-1",
			  "maxUsesPerCust": "-1",
			  "maxUsesOfPromo": "-1"
			},
			"meta": {
				"action": "create",  
				"schemaVer": "1.0"
			},
			"exclsve": 0,
			"isSitewideDeal": false,
			"promoCdRqrd": false,
			 "promoCdSpec": {
						"type": "Public", // Private sys gen, Public user gen
						"genType": "user", // user || system generated
					"cdLength": ""
			},
			"promoSubTypeCd": "",
			"promoSubTypeDesc": "",
			"promoType": 0,
			"purchaseConds": {
				"isInclusionsOrExclusionsExist": false, // if has inclusion or exclusion set true
				"channels": [87],
				"qualUOM": 'Quantity',
				"locations": [],
				"isTargetExist": false,
				"sources": [
				{
					"inclusions": {
							"partnumbers": [],
							"itemtype": "category",
							"hierarchies": [],
							"attrs": []
					},
					 "exclusions": {
					 		"partnumbers": [],
							"itemtype": "category",
							"hierarchies": [],
							"attrs": []
					},
					"minPurchaseQty": null
				}],
			},
			"reward": {
			  "type": "",
			  "method": "",
			  "details": [
			  {
						"qualUOM": "Quantity",
						"min": null,
						"max": null,
						"maxAllowedVal": null,
						"seq": "",
						"value": null
				}]
			},
			"couponId":null,
  			
		};
		return data;
	};
	return _construct;
}]);