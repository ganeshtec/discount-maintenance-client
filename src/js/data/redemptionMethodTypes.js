app.factory('redemptionMethodTypes', [function () {
    var _construct = function redemptionMethodTypes() {
        var data = [{
            value: false,
            label: 'Qualifying Purchase'
        },
        {
            value: true,
            label: 'Requires Promotion Codes'
        }
        ];
        return data;
    };
    return _construct;
}]);
