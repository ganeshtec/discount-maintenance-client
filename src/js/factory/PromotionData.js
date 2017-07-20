// Mock data for item level percent off promotion
app.factory('PromotionData', ['ALLOWED_PERMISSION_IDS',function (ALLOWED_PERMISSION_IDS) {
    var _construct = function PromotionData(userType) {
        var allowedPermissionIDs=ALLOWED_PERMISSION_IDS();
        var data = {
            'promoId': 0,
            'status': 20, // 20 draft
            'priority': 0,
            'shortDesc': '',
            'longDesc': '',
            'startDt': '',
            'endDt': '',
            'name': '',
            'printLabel': true,
            'labelText': '',
            'redmptnLmt': {
                'maxUsesPerOrd': '-1',
                'maxUsesPerCust': '-1',
                'maxUsesOfPromo': '-1'
            },
            'meta': {
                'action': 'create',
                'schemaVer': '1.0'
            },
            'exclsve': 0,
            'isSitewideDeal': false,
            'promoCdRqrd': false,
            'promoCdSpec': {
                'type': 'Public', // Private sys gen, Public user gen
                'genType': 'user', // user || system generated
                'cdLength': ''
            },
            'promoSubTypeCd': '',
            'promoSubTypeDesc': '',
            'promoType': 0,
            'purchaseConds': {
                'customerSegmentId': 0,
                'isInclusionsOrExclusionsExist': false, // if has inclusion or exclusion set true
                'channels': [87],
                'qualUOM': 'Quantity',
                'locations': [],
                'markets': [],
                'isTargetExist': false,
                'sources': [{
                    'inclusions': {
                        'partnumbers': [],
                        'itemtype': 'category',
                        'hierarchies': [],
                        'attrs': []
                    },
                    'exclusions': {
                        'partnumbers': [],
                        'itemtype': 'category',
                        'hierarchies': [],
                        'attrs': [],
                        'skuTypeAttrsInitialized': false
                    },
                    'minPurchaseQty': null
                }],
            },
            'reward': {
                'type': '',
                'method': '',
                'reasonCode': 49,
                'details': [{
                    'qualUOM': 'Quantity',
                    'min': null,
                    'max': null,
                    'maxAllowedVal': null,
                    'seq': '',
                    'value': null
                }]
            },
            'couponId': null,

        };
        if (userType == allowedPermissionIDs.ONLINE) {
            data.printLabel = false;
            data.purchaseConds.locations = [8119];
            data.purchaseConds.channels = [57];
        }
        return data;
    };

    return _construct;
}]);
