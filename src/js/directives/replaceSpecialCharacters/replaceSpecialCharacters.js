app.directive('replaceSpecialCharacters', [
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var regex=/[^0-9 a-zA-Z\(\?\-\_\.\"\'\*\,\%\$\!\@\)\/]/g;
                ctrl.$parsers.unshift(function (viewValue) {
                    var overrideValue = viewValue.replace(/[“”]/g, '"').replace(regex, '');
                    element.val(overrideValue);
                    return overrideValue;
                });
                element.bind('keypress', function (event) {
                    var keyCode = event.which || event.keyCode; // Safely get keyCode pressed from eventar); 
                    var keyCodeChar = String.fromCharCode(keyCode); // Determine the char from the keyCode. 
                    if (keyCodeChar.match(regex)){
                        scope.isLastKeyValid=false;
                    }else{
                        scope.isLastKeyValid=true;
                    }
                    return scope.isLastKeyValid;
                });
            }
        };
    }]);