app.directive('allowPattern', [
    function () {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            compile: function (tElement, tAttrs) {
                return function (scope, element, attrs) {
                    // Handle key events
                    element.bind('blur', function (event) {
                        var initVal = $(this).val();
                        var outputVal;
                        if ($(this).hasClass('buyAorB')) {
                            outputVal = initVal.replace(/[^0-9]/g, '');
                        } else {
                            outputVal = initVal.replace(/[^0-9 a-zA-Z\(\?\-\_\.\'\'\*\,\%\$\!\@\)]/g, '');
                        }


                        if (initVal != outputVal) {
                            $(this).val(outputVal);
                        }
                    });



                    element.bind('keypress', function (event) {
                        var keyCode = event.which || event.keyCode; // Safely get keyCode pressed from eventar); 

                        var keyCodeChar = String.fromCharCode(keyCode); // Determine the char from the keyCode. 

                        // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.

                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, 'i'))) {
                            var initVal = $(this).val();
                            var outputVal = initVal.replace(/[^0-9 a-zA-Z\(\?\-\_\.\'\'\*\,\%\$\!\@\)]/g, '');
                            if (initVal != outputVal) {
                                $(this).val(outputVal);
                            }
                            return false;
                        }
                    });
                };
            }
        };
    }
]);
