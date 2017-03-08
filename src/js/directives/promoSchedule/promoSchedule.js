// Purpose is to build promotion code spec.
app.directive('promoSchedule', ['$filter',
    function($filter) {
        return {
            restrict: 'E',
            templateUrl: 'promoSchedule.html',
            scope: {
                data: '=',
                promoform: '=',
                preview:'=',
                viewProp: '='
                },
            controller: function($scope) {
                $scope.$watch('data', function(nv, ov) {
                    if (nv) {
                        if (nv.startDt) {
                            $scope.startDt = new Date(nv.startDt.split(" ")[0].replace(/-/g, '\/'));
                        }
                        if (nv.endDt) {
                            $scope.endDt = new Date(nv.endDt.split(" ")[0].replace(/-/g, '\/'));
                        }
                        $scope.starttime = "3:00 AM";
                        $scope.endtime = "2:59 AM";


                    }
                });

            },
            link: function(scope, $element, attrs) {

                // init() {
                //     $scope.displayEndTime = true;
                // }

                scope.convertToString = function() {
                    if (scope.data) {
                        scope.data.startDt = $filter('date')(scope.startDt, 'yyyy-MM-dd HH:mm:ss');                     
                        scope.data.endDt = $filter('date')(scope.endDt, 'yyyy-MM-dd HH:mm:ss');
                        if (scope.data.endDt === scope.data.startDt) {
                            scope.promoform.end.$invalid = true;
                            scope.promoform.end.$error.min = true;
                        }
                    }


                };

                scope.isendDateInvalid = function() {
                    if (scope.data) {
                        if(!scope.data.endDt || !scope.data.startDt){
                            return false;
                        }
                        var isValid = scope.data.endDt > scope.data.startDt; // invalid
                        if (scope.promoform && scope.promoform.end) {
                            scope.promoform.end.$valid = isValid;
                            scope.promoform.end.$invalid = !isValid;
                        }
                        return !isValid

                    }

                };


            }
        };
    }]);