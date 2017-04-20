/* eslint-disable no-unused-vars */

// Purpose is to build promotion code spec.
app.directive('promoSchedule', ['$filter', 'leadTimeService', 'validationService',
    function ($filter, leadTimeService, validationService) {
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
                // scope.startDateLimit = new Date();
                // scope.startDateLimit.setDate(scope.startDateLimit.getDate() - 1);

                scope.validatePromotion = function() {
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                };
                
                scope.convertToString = function () {
                    if (scope.data) {
                        scope.data.startDt = $filter('date')(scope.startDt, 'yyyy-MM-dd');
                        scope.data.endDt = $filter('date')(scope.endDt, 'yyyy-MM-dd');
                    }
                    scope.validatePromotion();
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
                        var minEndDate = scope.getMinEndDate();
                        var isValid = scope.isEndDateValid(minEndDate);
                        console.log("minEndDate", minEndDate);
                        console.log("scope.data.endDt", scope.data.endDt);
                        if(!isValid) {
                            scope.promoform.end.$invalid = true;
                            scope.formHolder.form.$valid = false;
                            scope.promoform.end.$error.min = true;
                            return true;
                        } else {
                            scope.promoform.end.$invalid = false;
                            scope.formHolder.form.$valid = true;
                            return false;
                        }
                    } 
                }

                scope.getMinEndDate = function (value) {
                    var today = new Date();
                    var minEndDate = value ?
                        $filter('date')(today.setDate(today.getDate() + value), 'yyyy-MM-dd') :
                        $filter('date')(scope.data.startDt, 'yyyy-MM-dd');
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
