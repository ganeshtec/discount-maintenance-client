// Mock data for item level dollar off promotion
app.factory('orderLevelPercentOff', [function(){	
	var _construct = function itemLevelPercentOffData(){
		var data = {
			"promoId": "100",
			"status": 1,
			"priority": 10,
			"shortDesc": "Sample #1",
			"longDesc": "Sample Promotion JSON",
			"startDt": "2016-05-09T17:27:54.153Z",
			"endDt": "2016-05-09T17:27:54.153Z",
			"name": "Matt's Sample #1",
			"redmptnLmt": {
					"maxUsesPerOrd": 1,
					"maxUsesPerCust": 1,
					"maxUsesOfPromo": 1000
			},
			"meta": {
					"lastUpdatedBy": "sxs4119",
					"lastUpdated": "2016-05-09T17:27:54.153Z",
					"created": "2016-05-09T17:27:54.153Z",
					"action": "created",
					"schemaVer": "1.0"
			},
			"exclsve": 2,
			"isSitewideDeal": false,
			"promoCdRqrd": true,
			"promoCdSpec": {
					"type": "Public",
					"genType": "user input",
					"promoCodes": [
							"SummerSale2016"
					]
			},
			"promoSubTypeCd": "OrderLevelPercentDiscount ",
			"promoSubTypeDesc": "Percentage off of Order",
			"promoType": "ORDERPROMO",
			"purchaseConds": {
					"qualUOM": "Amount",
					"isTargetExist": false,
					"sources": [
							{
									"inclusions": {
											"hierarchies": [
													{
															"id": "18d83be6-a574-442f-a42b-165eb161f445",
															"name": "Wall Ovens",
															"catalog": "Web"
													},
													{
															"id": "40c59d47-ca51-460b-8d10-866428541d0d",
															"name": "Ranges",
															"catalog": "Web"
													}
											]
									},
									"exclusions": {
											"attrs": [
													{
															"name": "Mfg Brand Name",
															"operator": "EqualTo",
															"value": "Maytag"
													},
													{
															"name": "Mfg Brand Name",
															"operator": "NotEqualTo",
															"value": "Black & Decker"
													}
											]
									},
									"minTotalPrice": 0
							}
					]
			},
			"reward": {
					"type": "AMTOFF",
					"method": "WHOLEORDER",
					"details": [
							{
									"qualUOM": "Amount",
									"min": 100,
									"max": 115,
									"seq": "0",
									"value": 5
							},
							{
									"qualUOM": "Amount",
									"min": 116,
									"max": -1,
									"seq": "0",
									"value": 10
							}
					]
			}
	}
		return data;
	};
	
	return _construct;
}]);