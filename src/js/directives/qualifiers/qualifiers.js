// Purpose is to build promotion code spec.
app.directive('qualifiers', ['SourceData', 'customerSegmentDataService', '$mdDialog', '$rootScope', 'utilService', 'validationService', 'featureFlagService',
    function (SourceData, customerSegmentDataService, $mdDialog, $rootScope, utilService, validationService, featureFlagService) {
        return {
            restrict: 'E',
            templateUrl: 'qualifiers.html',
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

                var getCustomerSegmentPromise = customerSegmentDataService.getAllSegments();
                getCustomerSegmentPromise.then(
                    function (data) {
                        scope.segmentDetails = [];
                        angular.forEach(data.segments, function(segmentFromWebService){
                            var segment = {};
                            segment.name = segmentFromWebService.name;
                            segment.id = segmentFromWebService.id;
                            scope.segmentDetails.push(segment);

                            // If condition for Edit Customer Segment
                            if (scope.data.purchaseConds.customerSegmentId && scope.data.purchaseConds.customerSegmentId == segmentFromWebService.id) {
                                scope.data.custSegment = segment;
                            }
                        });
                        if(!scope.data.custSegment) {
                            scope.data.purchaseConds.customerSegmentId = 0;
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
