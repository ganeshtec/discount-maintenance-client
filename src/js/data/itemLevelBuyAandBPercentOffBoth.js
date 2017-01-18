// Mock data for item level percent off promotion
app.factory('itemLevelBuyAandBPercentOffBoth', [function(){	
	var _construct = function itemLevelPercentOffData(){
		var data = {
			"promoId": "1061143568",
			"status": "1",
			"priority": 50,
			"shortDesc": "DataSyncUT_Buy A and B, get a percentage off both_Qty_Partnum",
			"longDesc": "DataSyncUT_Buy A and B, get a percentage off both_Qty_Partnum",
			"startDt": "2016-05-09T04:00:00.000Z",
			"endDt": "2022-12-01T08:00:00.000Z",
			"name": "DataSyncUT_Buy A and B, get a percentage off both_Qty_Partnum-1061143568",
			"redmptnLmt": {
					"maxUsesPerOrd": 5,
					"maxUsesPerCust": 10,
					"maxUsesOfPromo": 2
			},
			"meta": {
					"action": "update",
					"created": "2016-05-09T17:27:57.058Z",
					"originated": "2016-05-09T15:46:05.000Z",
					"lastUpdated": "2016-05-09T17:27:57.059Z",
					"lastUpdatedBy": "1065877679",
					"schemaVer": "V1.0"
			},
			"exclsve": "0",
			"promoSubTypeCd": "MultipleItemsPercentDiscount",
			"promoSubTypeDesc": "Buy A and B, get a percentage off both",
			"promoType": "ITEMPROMO",
			"purchaseConds": {
					"qualUOM": "Quantity",
					"sources": [
							{
									"inclusions": {
											"partnumbers": [
													"202369941",
													"100008043"
											]
									},
									"minPurchaseQty": 2
							},
							{
									"inclusions": {
											"partnumbers": [
													"202041456",
													"100047887"
											]
									},
									"minPurchaseQty": 1
							}
					]
			},
			"reward": {
					"type": "PERCNTOFF",
					"method": "ALLAFFECTEDITMS",
					"details": [
							{
									"seq": "1",
									"qualUOM": "Quantity",
									"min": 3,
									"max": -1,
									"value": 10,
									"maxAllowedVal": 10
							}
					]
			}
	};
		return data;
	};
	
	return _construct;
}]);