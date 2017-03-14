// Purpose is to build promotion code spec.
app.directive('redemptionLimit', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'redemptionLimit.html',
            scope: {
                data: '=',
                promoform: '=',


            },
            controller: function($scope) {
                $scope.$watch('data', function(nv, ov) {
                    if (nv) {
                        if (nv.maxUsesPerCust != '-1') {
                            $scope.custmax = 'setcust';
                        }
                        if (nv.maxUsesOfPromo != '-1') {
                            $scope.promomax = 'promoset';
                        }
                        if (nv.maxUsesPerOrd != '-1') {
                            $scope.ordermax = 'setorder';
                        }

                    }





                });

            },
            link: function(scope, $element, attrs) {

                scope.promomax = 'promounlimt';
                scope.ordermax = 'orderunlimt';
                scope.custmax = 'custunlimt';

                scope.promocheck = function() {
                    if (scope.promomax === 'promounlimt') {
                        scope.data.maxUsesOfPromo = '-1';
                    }
                }
                scope.orderCheck = function() {
                    if (scope.ordermax === 'orderunlimt') {
                        scope.data.maxUsesPerOrd = '-1';
                    }
                }

                scope.custCheck = function() {

                    if (scope.custmax === 'custunlimt') {
                        scope.data.maxUsesPerCust = '-1';
                    }
                }

            }
        };
    }]);