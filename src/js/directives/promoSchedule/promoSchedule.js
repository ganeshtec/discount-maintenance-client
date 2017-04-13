// Purpose is to build promotion code spec.
app.directive('promoSchedule', ['$filter', 'leadTimeService', 
    function ($filter , leadTimeService) {
        return {
            restrict: 'E',
            templateUrl: 'promoSchedule.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                viewProp: '='
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

                scope.convertToString = function () {
                    if (scope.data) {
                        scope.data.startDt = $filter('date')(scope.startDt, 'yyyy-MM-dd');
                        scope.data.endDt = $filter('date')(scope.endDt, 'yyyy-MM-dd');
                        if (scope.data.endDt === scope.data.startDt) {
                            scope.promoform.end.$invalid = true;
                            scope.promoform.end.$error.min = true;
                        }
                    }


                };

                scope.isEndDateInvalid = function () {
                    minEndDate = scope.getMinEndDate();
                    console.log("earliest possible end date - " + minEndDate)
                    console.log("input end date - " + scope.data.endDt)
                    if (scope.data.endDt < minEndDate) {
                        console.log("FAILS Validation, End Date needs to account for " + scope.data.leadTime + " lead time.");
                        // trigger error message here
                    }
                };

                scope.getMinEndDate = function () {
                    scope.getLeadTime();
                    today = new Date();
                    minEndDate = today.setDate(today.getDate() + scope.data.leadTime);
                    return $filter('date')(minEndDate, 'yyyy-MM-dd');
                }

                scope.getLeadTime = function () {
                 
                    if(scope.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
                        var getLeadTimePromise = leadTimeService.fetchLeadTime();
                        getLeadTimePromise.then(function(data){
                            scope.data.leadTime = data;
                        })
                    }
                    else {
                        scope.data.leadTime = 0
                    }
                    return scope.data.leadTime;
                }


            }
        };
    }
]);
