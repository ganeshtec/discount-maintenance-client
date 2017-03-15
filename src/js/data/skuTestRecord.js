// Mock data for item level dollar off promotion
app.factory('skuTestRecord', [function () {
    var _construct = function skuTestRecord() {
        var data = {
            'validStoreInfo': [{
                'omsId': 100000066,
                'skuDescription': '100-080 S/O NORTHEAST TREATERS',
                'skuNumber': 100080,
                'prodName': '5-Pk. 4 X 3/4 In. 6T Reciprocating Saw Blade'
            }],
            'inValidStoreInfo': [
                33
            ]
        };
        return data;
    };
    return _construct;
}]);
