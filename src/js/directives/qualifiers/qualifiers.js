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

                scope.showBasketThreshold = false;

                var featureTogglePromise = featureFlagService.getFeatureFlags();
                featureTogglePromise.then(function (data) {
                    scope.showBasketThreshold = data.basketThreshold;
                    scope.useCustSegReasonCode = data.useCustSegReasonCode;
                });

                featureTogglePromise.then(function (data) {
                    scope.segmentsFromV2Endpoint = data.segmentsFromV2Endpoint;

                    if (!scope.segmentsFromV2Endpoint) {
                        var segmentsFromV1EndpointPromise = customerSegmentDataService.getAllSegments();
                        segmentsFromV1EndpointPromise.then(
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
                            }, function (error) { scope.discountEngineErrors.push(error); }
                        );
                    } else {
                        var segmentsFromV2EndpointPromise = customerSegmentDataService.getAllSegmentsV2EndPoint();
                        segmentsFromV2EndpointPromise.then(
                            function (data) {
                                scope.segmentListfromWebservice = data.segments;
                                var arrayLength = scope.segmentListfromWebservice.length;
                                scope.segmentDetails = [];
                                for (var i = 0; i < arrayLength; i++) {
                                    var segment = {};
                                    segment.name = scope.segmentListfromWebservice[i].segmentName;
                                    segment.id = scope.segmentListfromWebservice[i].segmentId;

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
                            function (error) {
                                scope.discountEngineErrors.push(error);
                            }
                        );
                    }
                });

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

                scope.updatePrintLabel = function () {
                    utilService.updatePrintLabel(scope.data);
                };

                scope.validatePromotion = function () {
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                };
            }
        }
    }
]);
