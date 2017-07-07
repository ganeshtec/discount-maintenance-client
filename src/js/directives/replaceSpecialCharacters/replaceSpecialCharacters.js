app.directive('replaceSpecialCharacters', [
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var overrideValue = viewValue.replace(/[“”]/g, '"').replace(/[^0-9 a-zA-Z\(\?\-\_\.\"\'\*\,\%\$\!\@\)\/]/g, '');
                    if (viewValue == overrideValue) {
                        return viewValue;
                    } else {
                        element.val(overrideValue);
                        return overrideValue;
                    }
                });
            }
        };
    }]);