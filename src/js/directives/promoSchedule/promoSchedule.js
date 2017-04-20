/* eslint-disable no-unused-vars */

// Purpose is to build promotion code spec.
app.directive('promoSchedule', ['$filter', 'leadTimeService',
    function ($filter, leadTimeService) {
        return {
            restrict: 'E',
            templateUrl: 'promoSchedule.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                viewProp: '=',
                formHolder: '='
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
                        scope.validateEndDate();
                    }
                };

                scope.validateEndDate = function (data) {
                    if (scope.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
                        var leadTimePromise = leadTimeService.fetchLeadTime();
                        leadTimePromise.then(function (value) {
                            var minEndDate = scope.getMinEndDate(value);
                            var isValid = scope.isEndDateValid(minEndDate);
                            if(!isValid) {
                                scope.promoform.end.$invalid = true;
                                scope.formHolder.form.$valid = false;
                                scope.promoform.end.$error.leadTime = true;
                                return true;
                            } else {
                                scope.promoform.end.$invalid = false;
                                scope.formHolder.form.$valid = true;
                                scope.promoform.end.$error.leadTime = false;
                                return false;
                            }
                        }
                    )} else {
                        scope.promoform.end.$invalid = false;
                        scope.formHolder.form.$valid = true;
                        scope.promoform.end.$error.leadTime = false;
                        return false
                    } 
                }

                scope.getMinEndDate = function (value) {
                    var today = new Date();
                    var minEndDate = $filter('date')(today.setDate(today.getDate() + value), 'yyyy-MM-dd');
                    scope.data.minEndDate = minEndDate;
                    return minEndDate;
                }

                scope.isEndDateValid = function (minDate) {
                    if (scope.data.endDt < minDate) {
                        return false;
                    } else {
                        return true;
                    }
                };
            }
        };
    }
]);
