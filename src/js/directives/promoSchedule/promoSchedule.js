/* eslint-disable no-unused-vars */

// Purpose is to build promotion code spec.
app.directive('promoSchedule', ['$filter', 'validationService',
    function ($filter, validationService) {
        return {
            restrict: 'E',
            templateUrl: 'promoSchedule.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                viewProp: '=',
                formHolder: '=',
                validationErrors: '='
            },
            controller: function ($scope) {
                $scope.$watch('data', function (nv) {
                    if (nv) {
                        if (nv.startDt) {
                            $scope.startDt = new Date(nv.startDt.split(' ')[0].replace(/-/g, '\/'));
                        }
                        if (nv.endDt) {
                            $scope.endDt = new Date(nv.endDt.split(' ')[0].replace(/-/g, '\/'));
                        }
                        $scope.starttime = '3:00 AM';
                        $scope.endtime = '2:59 AM';
                    }
                });
            
            

            },
            link: function (scope) {

              
                scope.validatePromotion = function() {
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                };
                
                if(scope.data.startDt || scope.data.endDt){
                scope.validatePromotion(scope.data);
                }

                scope.convertToString = function () {
                    if (scope.data) {
                        scope.data.startDt = $filter('date')(scope.startDt, 'yyyy-MM-dd');
                        scope.data.endDt = $filter('date')(scope.endDt, 'yyyy-MM-dd');
                    }
                    scope.validatePromotion(scope.data);
                };


               

            }
        };
    }
]);
