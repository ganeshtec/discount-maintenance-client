// Purpose is to build promotion code spec.
app.directive('purchaseConditionRewards', ['SourceData', 'customerSegmentDataService', '$mdDialog', '$rootScope', 'utilService', 'validationService', 'featureFlagService',
    function (SourceData, customerSegmentDataService, $mdDialog, $rootScope, utilService, validationService, featureFlagService) {
        return {
            restrict: 'E',
            templateUrl: 'purchaseConditionRewards.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                isDisabled: '=',
                viewProp: '=',
                validationErrors: '='
            },

            link: function (scope) {
                // Customer Segment JS code

                var getCusSegmentPromise = customerSegmentDataService.getAllSegments();
                getCusSegmentPromise.then(
                    function (data) {
                        scope.segmentListfromWebservice = data.segments;
                        var objearraySize = scope.segmentListfromWebservice.length;
                        scope.segmentDetails = [];
                        for (var i = 0; i < objearraySize; i++) {
                            var segment = {};
                            segment.name = scope.segmentListfromWebservice[i].name;
                            segment.id = scope.segmentListfromWebservice[i].id;

                            // If condition for Edit Customer Segment

                            if (scope.data.purchaseConds.customerSegmentId) {
                                if (scope.data.purchaseConds.customerSegmentId == scope.segmentListfromWebservice[i].id) {
                                    scope.data.custSegment = segment;
                                }
                            } else {
                                scope.data.purchaseConds.customerSegmentId = 0;
                            }
                            scope.segmentDetails.push(segment);
                        }
                    },
                    function () {
                        // Should we have some error handling logic here?
                    }
                );

                scope.onSegmentSelection = function () {
                    if (scope.data.custSegment) {
                        scope.data.purchaseConds.customerSegmentId = scope.data.custSegment.id;
                        if (scope.useCustSegReasonCode && scope.data.custSegment.id != 0) {
                            scope.data.reward.reasonCode = 70;
                        }

                    } else {
                        scope.data.reward.reasonCode = 49;
                        scope.data.purchaseConds.customerSegmentId = 0;
                    }
                };
                // End of Customer Segment

                scope.updatePrintLabel = function () {
                    utilService.updatePrintLabel(scope.data);
                }

                scope.validatePromotion = function () {
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                }

                scope.showBasketThreshold = false;

                var featureTogglePromise = featureFlagService.getFeatureFlags();
                featureTogglePromise.then(function (data) {
                    scope.showBasketThreshold = data.basketThreshold;
                    scope.useCustSegReasonCode = data.useCustSegReasonCode;
                })
            }
        }
    }
]);
