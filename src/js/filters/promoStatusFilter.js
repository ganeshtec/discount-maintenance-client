// code replaced by service
app.filter('promoStatus', function () {
    return function (code) {
        var mapping = {
            '1': 'Active',
            '2': 'Inactive',
            '#': 'Draft'
        }
        return mapping[code];
    };
});
