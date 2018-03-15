// Purpose is to build promotion code spec.
app.component('qualifiers', {
    templateUrl: 'qualifiers.html',
    bindings: {
        data: '=',
        promoform: '=',
        preview: '=',
        isDisabled: '=',
        viewProp: '=',
        validationErrors: '='
    },
    controller: QualifiersController

});


function QualifiersController(customerSegmentDataService, utilService, validationService, featureFlagService) {
    var ctrl = this;
    ctrl.showBasketThreshold = false;


    ctrl.$onInit = function () {
        var featureTogglePromise = featureFlagService.getFeatureFlags();
        featureTogglePromise.then(function (data) {
            ctrl.showBasketThreshold = data.basketThreshold;
            ctrl.useCustSegReasonCode = data.useCustSegReasonCode;
        });

        featureTogglePromise.then(function (data) {
            ctrl.segmentsFromV2Endpoint = data.segmentsFromV2Endpoint;

            if (!ctrl.segmentsFromV2Endpoint) {
                var segmentsFromV1EndpointPromise = customerSegmentDataService.getAllSegments();
                segmentsFromV1EndpointPromise.then(
                    function (data) {
                        ctrl.segmentDetails = [];
                        angular.forEach(data.segments, function (segmentFromWebService) {
                            var segment = {};
                            segment.name = segmentFromWebService.name;
                            segment.id = segmentFromWebService.id;
                            ctrl.segmentDetails.push(segment);

                            // If condition for Edit Customer Segment
                            if (ctrl.data.purchaseConds.customerSegmentId && ctrl.data.purchaseConds.customerSegmentId == segmentFromWebService.id) {
                                ctrl.data.segment = segment;
                            }
                        });
                        if (!ctrl.data.segment) {
                            ctrl.data.purchaseConds.customerSegmentId = 0;
                        }
                    }, function (error) { ctrl.discountEngineErrors.push(error); }
                );
            } else {
                var segmentsFromV2EndpointPromise = customerSegmentDataService.getAllSegmentsV2EndPoint();
                segmentsFromV2EndpointPromise.then(
                    function (data) {
                        ctrl.segmentListfromWebservice = data.segments;
                        var arrayLength = ctrl.segmentListfromWebservice.length;
                        ctrl.segmentDetails = [];
                        for (var i = 0; i < arrayLength; i++) {
                            var segment = {};
                            segment.name = ctrl.segmentListfromWebservice[i].segmentName;
                            segment.id = ctrl.segmentListfromWebservice[i].segmentId;
                            segment.progId = ctrl.segmentListfromWebservice[i].programId;
                            segment.tierId = ctrl.segmentListfromWebservice[i].tierId;

                            // If condition for Edit Customer Segment
                            if (ctrl.data.purchaseConds.customerSegmentId || (ctrl.data.purchaseConds.program.id && ctrl.data.purchaseConds.program.tierId)) {
                                if ((ctrl.data.purchaseConds.customerSegmentId == ctrl.segmentListfromWebservice[i].segmentId) ||
                                    (((ctrl.data.purchaseConds.program.id == ctrl.segmentListfromWebservice[i].programId)
                                        && (ctrl.data.purchaseConds.program.tierId == ctrl.segmentListfromWebservice[i].tierId)))) {
                                    ctrl.data.segment = segment;
                                }
                            } else {
                                ctrl.data.purchaseConds.customerSegmentId = 0;
                                ctrl.data.purchaseConds.program.id = 0;
                                ctrl.data.purchaseConds.program.tierId = 0;
                            }
                            ctrl.segmentDetails.push(segment);
                        }
                    },
                    function (error) {
                        ctrl.discountEngineErrors.push(error);
                    }
                );
            }
        });



    };

    ctrl.onSegmentSelection = function () {
        if (ctrl.data.segment) {
            if (ctrl.data.segment.id) {
                ctrl.data.purchaseConds.customerSegmentId = ctrl.data.segment.id;
                ctrl.data.purchaseConds.program = {};
            }
            else {
                ctrl.data.purchaseConds.customerSegmentId = 0;
            }
            if (ctrl.data.segment.progId) {

                ctrl.data.purchaseConds.program.id = ctrl.data.segment.progId;
            }
            else {
                ctrl.data.purchaseConds.program.id = 0;

            }
            if (ctrl.data.segment.tierId) {
                ctrl.data.purchaseConds.program.tierId = ctrl.data.segment.tierId;
            }
            else {
                ctrl.data.purchaseConds.program.tierId = 0;
            }
            if (ctrl.useCustSegReasonCode && ctrl.data.segment.id != 0) {
                ctrl.data.reward.reasonCode = 70;
            }
            else {
                ctrl.data.reward.reasonCode = 49;
            }


        } else {
            ctrl.data.reward.reasonCode = 49;
            ctrl.data.purchaseConds.customerSegmentId = 0;

            ctrl.data.purchaseConds.program.id = 0;

            ctrl.data.purchaseConds.program.tierId = 0;
        }
    };


    ctrl.updatePrintLabel = function () {
        utilService.updatePrintLabel(ctrl.data);
    };

    ctrl.validatePromotion = function () {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    };

}


