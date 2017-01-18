// Mock data for item level percent off promotion
app.factory('buyXGetYFree', [function(){	
	var _construct = function itemLevelPercentOffData(){
		var data = {
			"promoId": "1061143593",
			"status": "1",
			"priority": 555,
			"shortDesc": "DataSyncUT_Buy item X, get item Y free",
			"longDesc": "DataSyncUT_Buy item X, get item Y free",
			"startDt": "2016-05-08T07:00:00.000Z",
			"endDt": "2023-05-24T06:59:00.000Z",
			"name": "DataSyncUT_Buy item X, get item Y free-1061143593",
			"redmptnLmt": {
					"maxUsesPerOrd": 23,
					"maxUsesPerCust": 48,
					"maxUsesOfPromo": 15
			},
			"meta": {
					"action": "update",
					"created": "2016-05-09T17:27:57.595Z",
					"originated": "2016-05-09T16:43:24.000Z",
					"lastUpdated": "2016-05-09T17:27:57.595Z",
					"lastUpdatedBy": "1065877679",
					"schemaVer": "V1.0"
			},
			"exclsve": "0",
			"promoSubTypeCd": "ProductLevelBuyXGetYFree",
			"promoSubTypeDesc": "Buy item X, get item Y free",
			"promoType": "ITEMPROMO",
			"purchaseConds": {
					"qualUOM": "Quantity",
					"isTargetExist": true,
					"sources": [
							{
									"inclusions": {
											"partnumbers": [
													"100672563",
													"100318041",
													"100318049"
											]
									},
									"exclusions": {
											"partnumbers": [
													"202075159",
													"202489241"
											]
									},
									"minPurchaseQty": 41
							}
					],
					"targets": [
							{
									"inclusions": {
											"partnumbers": [
													"100430055"
											]
									},
									"minPurchaseQty": 66
							}
					]
			},
			"reward": {
					"type": "GIFT",
					"method": "ALLAFFECTEDITMS",
					"details": [
							{
									"seq": "1",
									"qualUOM": "Quantity",
									"min": 41,
									"max": -1
							}
					]
			}
	};
		return data;
	};
	
	return _construct;
}]);