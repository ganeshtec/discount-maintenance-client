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
                console.log('create');
                 console.log(scope.preview);
                if (!scope.data) {
                    scope.data = [];
                }
            }
        };
    }]);