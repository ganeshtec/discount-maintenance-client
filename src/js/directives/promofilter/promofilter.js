app.directive('promofilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'promofilter.html',
        scope: {
            statuslist: '=',
            typelist: '=',
            onfilter: '&',
        },
        controller: function () {},
        link: function (scope) {
            scope.pages = [];
            scope.apply = function () {
                scope.onFilter()(scope.status, scope.type);
            }
        }
    }
});
