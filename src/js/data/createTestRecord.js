// Mock data for item level dollar off promotion
app.factory('createTestRecord', [function () {
    var _construct = function createTestRecord() {
        var data = {
            'promoId': 293,
            'promoSubTypeDesc': 'Amount off an order - OrderLevelValueDiscount',
            'promoType': 'ORDERPROMO',
            'promoSubTypeCd': 'OrderLevelValueDiscount',
            'origRequestId': null,
            'reward': {
                'details': [{
                    'qualUOM': 'Quantity',
                    'value': '2.00',
                    'seq': 1,
                    'max': 3,
                    'min': 3,
                    'maxAllowedVal': null
                },
                {
                    'qualUOM': 'Quantity',
                    'value': '3.00',
                    'seq': 2,
                    'max': 4,
                    'min': 4,
                    'maxAllowedVal': null
                },
                {
                    'qualUOM': 'Quantity',
                    'value': '6.00',
                    'seq': 4,
                    'max': -1,
                    'min': 6,
                    'maxAllowedVal': null
                },
                {
                    'qualUOM': 'Quantity',
                    'value': '5.00',
                    'seq': 3,
                    'max': 5,
                    'min': 5,
                    'maxAllowedVal': null
                }
                ],
                'method': 'WHOLEORDER',
                'type': 'AMTOFF'
            },
            'status': 20,
            'endDt': '2016-09-24 00:00:00',
            'exclsve': 0,
            'isSitewideDeal': false,
            'shortDesc': ' ',
            'meta': {
                'action': null,
                'schemaVer': '1',
                'lastUpdatedBy': 'nxp8648',
                'lastUpdated': '2016-09-23 14:20:53',
                'created': '2016-09-23 14:20:53',
                'createdBy': 'nxp8648'
            },
            'redmptnLmt': {
                'maxUsesPerCust': '-1',
                'maxUsesOfPromo': '-1',
                'maxUsesPerOrd': '-1'
            },
            'priority': 800,
            'startDt': '2016-09-23 00:00:00',
            'name': 'Order Level_Amount Off_Dishwasher',
            'promoPgmId': 0,
            'expireDtExtDays': 0,
            'promoCdRqrd': false,
            'priorityCd': 0,
            'purchaseConds': {
                'qualUOM': 'Quantity',
                'isTargetExist': null,
                'tenderTypes': null,
                'isInclusionsOrExclusionsExist': true,
                'sources': [{
                    'minTotalPrice': null,
                    'minPurchaseQty': 3,
                    'inclusions': {
                        'partnumbers': [
                            205189915,
                            100386383,
                            203516475,
                            203516463
                        ],
                        'hierarchies': null,
                        'attrs': null
                    },
                    'exclusions': {
                        'partnumbers': [],
                        'hierarchies': null,
                        'attrs': null
                    }
                }],
                'targets': []
            },
            'longDesc': ' ',
            'promoCdSpec': null,
            'couponId': null
        };
        return data;
    };
    return _construct;
}]);
