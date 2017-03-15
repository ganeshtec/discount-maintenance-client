// Mock data for item level percent off promotion
app.factory('itemLevelPercentOffData', [function () {
    var _construct = function itemLevelPercentOffData() {
        var data = {
            'promoId': '100',
            'status': 1,
            'priority': 10,
            'shortDesc': 'Sample #1',
            'longDesc': 'Sample Promotion JSON',
            'startDt': '2016-05-09T17:27:54.153Z',
            'endDt': '2016-05-09T17:27:54.153Z',
            'name': 'Matt\'s Sample #1',
            'redmptnLmt': {
                'maxUsesPerOrd': 1,
                'maxUsesPerCust': 1,
                'maxUsesOfPromo': 1000
            },
            'meta': {
                'lastUpdatedBy': 'sxs4119',
                'lastUpdated': '2016-05-09T17:27:54.153Z',
                'created': '2016-05-09T17:27:54.153Z',
                'action': 'created',
                'schemaVer': '1.0'
            },
            'exclsve': 2,
            'isSitewideDeal': true,
            'promoCdRqrd': true,
            'promoCdSpec': {
                'type': 'Private',
                'genType': 'system generated',
                'systemGen': {
                    'uniqueCdCnt': '5',
                    'cdPrefix': 'Summer_',
                    'cdSuffix': '_2016'
                },
                'cdLength': 30
            },
            'promoSubTypeCd': 'ProductLevelPercentDiscount',
            'promoSubTypeDesc': 'Percentage off of Subtotal of items',
            'promoType': 'ITEMPROMO',
            'purchaseConds': {
                'qualUOM': 'Quantity',
                'isTargetExist': false,
                'sources': [{
                    'inclusions': {
                        'partnumbers': [
                            '205930191',
                            '205931489'
                        ]
                    },
                    'minPurchaseQty': 1
                }]
            },
            'reward': {
                'type': 'PERCNTOFF',
                'method': 'ALLAFFECTEDITMS',
                'details': [{
                    'qualUOM': 'Quantity',
                    'min': 10,
                    'max': -1,
                    'maxAllowedVal': 100,
                    'seq': '0',
                    'value': 5
                }]
            }
        };
        return data;
    };
    return _construct;
}]);
