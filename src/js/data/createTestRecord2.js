// Mock data for item level dollar off promotion
app.factory('createTestRecord2', [function() {
		var _construct = function createTestRecord() {
				var data = {
						"couponId": 0,
						"endDt":"string",
						"exclsve": 0,
						"expireDtExtDays": 0,
						"isSitewideDeal": true,
						"longDesc":"string",
						"meta": {
							"action":"string",
							"created": {
								"chronology": {},
								"millis": 0
							},
							"lastUpdated": {
								"chronology": {},
								"millis": 0
							},
							"lastUpdatedBy":"string",
							"originated": {
								"chronology": {},
								"millis": 0
							},
							"schemaVer":"string"
						},
						"name":"string",
						"priority": 0,
						"priorityCd": 0,
						"promoCdRqrd": true,
						"promoCdSpec": {
							"cdLength": 0,
							"genType":"string",
							"promoCodes": [
								"string"
							 ],
							"systemGen": {
								"cdPattern":"string",
								"cdPrefix":"string",
								"cdSuffix":"string",
								"uniqueCdCnt":"string"
							},
							"type":"string"
						},
						"promoId": 0,
						"promoPgmId": 0,
						"promoSubTypeCd":"AMTOFF",
						"promoSubTypeDesc":"string",
						"promoTypeCd":"ITEMPROMO",
						"purchaseConds": {
							"channels": [
								"string"
							 ],
							"customers": [
								"string"
							 ],
							"isTargetExist": true,
							"qualUOM":"Quantity",
							"sources": [
								 {
									"exclusions": {
										"attrs": [
											 {
												"name":"string",
												"operator":"string",
												"value":"string"
											}
										 ],
										"hierarchies": [
											 {
												"catalog":"string",
												"id":"string",
												"name":"string"
											}
										 ],
										"partnumbers": [
											"string"
										 ],
										"stores": [
											"string"
										 ]
									},
									"inclusions": {
										"attrs": [
											 {
												"name":"string",
												"operator":"string",
												"value":"string"
											}
										 ],
										"hierarchies": [
											 {
												"catalog":"string",
												"id":"string",
												"name":"string"
											}
										 ],
										"partnumbers": [
											"string"
										 ],
										"stores": [
											"string"
										 ]
									},
									"minPurchaseQty": 0,
									"minTotalPrice": 0
								}
							 ],
							"targets": [
								 {
									"exclusions": {
										"attrs": [
											 {
												"name":"string",
												"operator":"string",
												"value":"string"
											}
										 ],
										"hierarchies": [
											 {
												"catalog":"string",
												"id":"string",
												"name":"string"
											}
										 ],
										"partnumbers": [
											"string"
										 ],
										"stores": [
											"string"
										 ]
									},
									"inclusions": {
										"attrs": [
											 {
												"name":"string",
												"operator":"string",
												"value":"string"
											}
										 ],
										"hierarchies": [
											 {
												"catalog":"string",
												"id":"string",
												"name":"string"
											}
										 ],
										"partnumbers": [
											"string"
										 ],
										"stores": [
											"string"
										 ]
									},
									"minPurchaseQty": 0,
									"minTotalPrice": 0
								}
							 ],
							"tenderTypes": [
								"string"
							 ]
						},
						"reasonCd": 0,
						"reward": {
							"details": [
								 {
									"max": 0,
									"maxAllowedVal": 0,
									"min": 0,
									"qualUOM":"Quantity",
									"seq":"string",
									"value": 0
								}
							 ],
							"method":"WHOLEORDER",
							"type":"AMTOFF"
						},
						"shortDesc":"string",
						"startDt":"string",
						"status":"INACTIVE"
						};
				return data;
		};

		return _construct;
}]);
