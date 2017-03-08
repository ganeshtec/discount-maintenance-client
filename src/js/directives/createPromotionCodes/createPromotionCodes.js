// Purpose is to build promotion data.
app.directive('createPromotionCodes', ['PROMOCODE',
    function(PROMOCODE) {
        return {
            restrict: 'E',
            templateUrl: 'createPromotionCodes.html',
            scope: {
                data: '=',
                promoform: '=',
                preview:'='
            },
            link: function(scope, $element, attrs) {
                if (!scope.data) {
                    scope.data = [];
                }
            }
        };
    }]);