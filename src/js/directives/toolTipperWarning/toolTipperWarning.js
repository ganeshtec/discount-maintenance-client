app.directive('toolTipperWarning', [
    function () {
        return {
            restrict: 'E',
            scope: {
                showToolTip: '<'
            },
            transclude: true,
            templateUrl: 'toolTipperWarning.html'
        };
    }
]);
