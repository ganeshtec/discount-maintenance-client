// Mock data for item level percent off promotion
app.factory('itemLevelBuyXGetYPercentOff2', [function(){	
	var _construct = function itemLevelPercentOffData(){
		var data = {
			"promoId": "1061143591",
			"status": "1",
			"priority": 345,
			"shortDesc": "DataSyncUT_Buy item X, get a percentage off item Y",
			"longDesc": "DataSyncUT_Buy item X, get a percentage off item Y",
			"startDt": "2016-05-08T07:00:00.000Z",
			"endDt": "2022-05-27T06:59:00.000Z",
			"name": "DataSyncUT_Buy item X, get a percentage off item Y-1061143591",
			"redmptnLmt": {
					"maxUsesPerOrd": 12,
					"maxUsesPerCust": 3532,
					"maxUsesOfPromo": 14
			},
			"meta": {
					"action": "update",
					"created": "2016-05-09T17:27:57.558Z",
					"originated": "2016-05-09T16:36:15.000Z",
					"lastUpdated": "2016-05-09T17:27:57.558Z",
					"lastUpdatedBy": "1065877679",
					"schemaVer": "V1.0"
			},
			"exclsve": "0",
			"promoSubTypeCd": "ProductLevelPWPPercentDiscount",
			"promoSubTypeDesc": "Buy item X, get a percentage off item Y",
			"promoType": "ITEMPROMO",
			"purchaseConds": {
					"qualUOM": "Quantity",
					"isTargetExist": true,
					"sources": [
							{
									"inclusions": {
											"partnumbers": [
													"100658396",
													"100658841",
													"100372202"
											]
									},
									"exclusions": {
											"partnumbers": [
													"100658388",
													"100658407"
											]
									},
									"minPurchaseQty": 4
							}
					],
					"targets": [
							{
									"inclusions": {
											"hierarchies": [],
											"partnumbers": [
													"100653760",
													"100645167",
													"100645168"
											]
									},
									"exclusions": {
											"hierarchies": [],
											"partnumbers": [
													"100658408",
													"100645158"
											]
									},
									"minPurchaseQty": 3
							}
					]
			},
			"reward": {
					"type": "PERCNTOFF",
					"method": "ALLAFFECTEDITMS",
					"details": [
							{
									"seq": "0",
									"qualUOM": "Quantity",
									"min": 3,
									"max": -1,
									"value": 43,
									"maxAllowedVal": 12.23
							}
					]
			}
	};
		return data;
	};
	
	return _construct;
}]);