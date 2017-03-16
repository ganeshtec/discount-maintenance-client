app.directive('browseCatalogBtn', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'browseCatalogBtn.html',
            link: function (scope) {

                scope.browseCatalog = function () {
                    scope.$emit('btnBrowseOnClick');

                }

            }
        };
    }
]);
