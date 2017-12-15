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

                scope.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

                if (scope.data && scope.data.purchaseConds && scope.data.purchaseConds.sources && scope.data.purchaseConds.sources.length === 0) {

                    if (scope.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || scope.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                        scope.data.purchaseConds.sources.push(new SourceData());
                        scope.data.purchaseConds.sources.push(new SourceData());
                    } else {
                        scope.data.purchaseConds.sources.push(new SourceData());
                    }

                }

                if (scope.data && scope.data.purchaseConds && scope.data.purchaseConds.sources && scope.data.purchaseConds.sources.length === 1) {
                    if (scope.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || scope.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                        scope.data.purchaseConds.sources.push(new SourceData());

                    }
                }
                scope.updatePrintLabel = function () {
                    utilService.updatePrintLabel(scope.data);
                }

                scope.initializePurchaseOption = function (index, item, data) {
                    if (data.purchaseConds.sources[index].purchaseoption == 'category') {
                        data.purchaseConds.sources[index].purchaseoption = 'category'
                    } else if (data.purchaseConds.sources[index].purchaseoption == 'itemoms') {


                        data.purchaseConds.sources[index].purchaseoption = 'itemoms'
                    } else if (item.inclusions.partnumbers != null && item.inclusions.partnumbers.length > 0) {

                        if (item.inclusions.itemtype == 'OMS') {
                            data.purchaseConds.sources[index].purchaseoption = 'itemoms'
                        } else if (item.inclusions.itemtype == 'SKU') {
                            data.purchaseConds.sources[index].purchaseoption = 'itemsku'
                        } else {

                            data.purchaseConds.sources[index].purchaseoption = 'category'
                        }

                    } else if (item.inclusions.hierarchies != null && item.inclusions.hierarchies.length > 0) {

                        data.purchaseConds.sources[index].purchaseoption = 'category'
                    } else {
                        data.printLabel = false;
                        data.purchaseConds.sources[index].purchaseoption = 'category'
                    }

                }

                scope.showSkuTypeModal = function (ev, source, promostatus) {
                    scope.source = source;
                    scope.promostatus = promostatus;
                    $mdDialog.show({
                        template: '<sku-type-modal source="source" promo-status="promostatus"></sku-type-modal>',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        scope: scope,
                        preserveScope: true
                    }).finally(function () {
                        $rootScope.$broadcast('refreshSkuTypeValidations');
                    });
                }

                scope.removeAll = function () {
                    for (var i = 0; i < scope.data.purchaseConds.sources.length; i++) {
                        scope.data.purchaseConds.sources[i].inclusions.partnumbers = [];
                        scope.data.purchaseConds.sources[i].exclusions = {};
                        scope.data.purchaseConds.sources[i].exclusions.attrs = {};
                        scope.data.purchaseConds.sources[i].exclusions.initializeSkuTypeExclusions = true;
                    }

                    $rootScope.$broadcast('clearCategories');
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
