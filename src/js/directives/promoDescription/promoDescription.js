// Purpose is to build promotion code spec.
app.directive('promoDescription', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'promoDescription.html',
            scope: {
                data: '='

            }
        };
    }
]);
