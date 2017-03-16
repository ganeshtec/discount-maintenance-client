// Purpose is to build promotion code spec.
app.directive('purchaseConditionRewards', ['SourceData', 'customerSegmentDataService',
    function (SourceData, customerSegmentDataService) {
        return {
            restrict: 'E',
            templateUrl: 'purchaseConditionRewards.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                isDisabled: '=',
                viewProp: '='
            },

            link: function (scope) {
                // Customer Segment JS code
                var getCusSegmentPromise = customerSegmentDataService.getAllSegments();
                getCusSegmentPromise.then(
                    function (data) {
                        scope.segmentListfromWebservice = data.segments;
                        // START
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

                        //END
                    },
                    function () {
                        // Should we have some error handling logic here?
                    }
                );

                scope.onSegmentSelection = function () {
                    if (scope.data.custSegment) {
                        scope.data.purchaseConds.customerSegmentId = scope.data.custSegment.id;
                    } else {
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

                        data.purchaseConds.sources[index].purchaseoption = 'category'
                    }

                }




            }
        }
    }
]);
