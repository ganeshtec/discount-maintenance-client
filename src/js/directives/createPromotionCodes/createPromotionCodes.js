// Purpose is to build promotion data.
app.directive('createPromotionCodes', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'createPromotionCodes.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '='
            },
            link: function (scope) {
                if (!scope.data) {
                    scope.data = [];
                }
            }
        };
    }
]);
