app.component('purchaseCondition', {
    templateUrl: 'purchaseCondition.html',
    bindings: {
        data: '=',
        qualUOM: '=',
        promoform: '=',
        preview: '=',
        isDisabled: '=',
        purchaseCondition: '=',
        promotype: '=',
        viewProp: '=',
        validationErrors: '='
    },
    controller: PurchaseConditionController
});

PurchaseConditionController.$inject = ['$rootScope', '$mdDialog', 'SourceData', 'validationService', 'utilService', '$cookies', 'customerSegmentDataService', 'featureFlagService'];

function PurchaseConditionController($rootScope, $mdDialog, SourceData, validationService, utilService, $cookies, customerSegmentDataService, featureFlagService) {
    var ctrl = this;
    ctrl.setQualUOM = setQualUOM;
    ctrl.addPurchaseCondition = addPurchaseCondition;
    ctrl.removePurchaseCondition = removePurchaseCondition;
    ctrl.validatePromotion = validatePromotion;
    ctrl.roundPercentage = roundPercentage;
    ctrl.updatePrintLabel = updatePrintLabel;
    ctrl.getRewardLabel = getRewardLabel;
    ctrl.setRewardMethod = setRewardMethod;
    ctrl.isSingleSourcePurchaseCondition = isSingleSourcePurchaseCondition;
    ctrl.isMultiSourcePurchaseCondition = isMultiSourcePurchaseCondition;
    ctrl.getAllSegments = getAllSegments;
    ctrl.onSegmentSelection = onSegmentSelection;
    ctrl.initializePurchaseOption = initializePurchaseOption;
    ctrl.showSkuTypeModal = showSkuTypeModal;
    ctrl.removeAll = removeAll;
    ctrl.isMFAUser;
    ctrl.isDCMUser;
    ctrl.rewardTypeLabel='Percentage';
    ctrl.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    ctrl.showBasketThreshold = false;

    ctrl.$onInit = $onInit;

    if ($cookies.get('currentUserRole') != null) {
        var currentUserRole = $cookies.get('currentUserRole');
        ctrl.userType = parseInt(currentUserRole);
    }

    function $onInit() {
        ctrl.getAllSegments();
        switch (ctrl.userType) {
        case 229:
            ctrl.isDCMUser = true;
            ctrl.thresholdHeaderLabel = 'Minimum purchase type';
            ctrl.thresholdQuantityLabel = 'Quantity purchase';
            ctrl.thresholdAmountLabel = 'Amount spent';
            break
        case 228:
            ctrl.isMFAUser = true;
            ctrl.thresholdHeaderLabel = 'Threshold';
            ctrl.thresholdQuantityLabel = 'Quantity';
            ctrl.thresholdAmountLabel = 'Dollar';
            if(ctrl.data.reward && !ctrl.data.reward.type) {
                ctrl.data.reward.type = 'PERCNTOFF';
            }
            if(!ctrl.data.promoType) {
                ctrl.data.promoType = 'ITEMPROMO';
            }
            ctrl.setRewardMethod();
            break
        }
        ctrl.qualuom = (ctrl.data.reward && ctrl.data.reward.details[0].qualUOM) || 'Quantity';
        ctrl.setQualUOM(ctrl.qualuom);

        if (ctrl.data && ctrl.data.purchaseConds && ctrl.data.purchaseConds.sources && ctrl.data.purchaseConds.sources.length === 0) {

            if (ctrl.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || ctrl.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                ctrl.data.purchaseConds.sources.push(new SourceData());
                ctrl.data.purchaseConds.sources.push(new SourceData());
            } else {
                ctrl.data.purchaseConds.sources.push(new SourceData());
            }

        }

        if (ctrl.data && ctrl.data.purchaseConds && ctrl.data.purchaseConds.sources && ctrl.data.purchaseConds.sources.length === 1) {
            if (ctrl.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || ctrl.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                ctrl.data.purchaseConds.sources.push(new SourceData());

            }
        }
    }
    function setQualUOM(qualuom) {
        if (ctrl.data.reward.details) {
            for (var i = 0; i < ctrl.data.reward.details.length; i++) {
                ctrl.data.reward.details[i].qualUOM = qualuom;
            }
        }
        ctrl.data.purchaseConds.qualUOM = qualuom;
    }

    function getRewardLabel() {
        var rewardTypeLabel = 'Percentage';
        switch(ctrl.data.reward.type){
        case 'AMTOFF':
            rewardTypeLabel='Amount';
            break;    
        case 'PERCNTOFF':
            rewardTypeLabel='Percentage';
            break;    
        }
        return rewardTypeLabel;
    }

    function setRewardMethod() {
        switch(ctrl.data.promoType){
        case 'ITEMPROMO':
            ctrl.data.reward.method = 'INDVDLAFFECTEDITMS';
            break;    
        case 'ORDERPROMO':
            ctrl.data.reward.method = 'WHOLEORDER';
            break;    
        }
    }

    function isSingleSourcePurchaseCondition() {
        return ctrl.purchaseCondition && ctrl.purchaseCondition.sources && ctrl.purchaseCondition.sources.length == 1;
    }

    function isMultiSourcePurchaseCondition() {
        return ctrl.purchaseCondition && ctrl.purchaseCondition.sources && ctrl.purchaseCondition.sources.length > 1;
    }

    function updatePrintLabel() {
        utilService.updatePrintLabel(ctrl.data);
    }

    function addPurchaseCondition() {
        ctrl.data.reward.details = ctrl.data.reward.details || [];
        ctrl.data.reward.details.push({});
        ctrl.updatePrintLabel();
    }

    function validatePromotion() {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    }

    function removePurchaseCondition(index) {
        ctrl.data.reward.details.splice(index, 1);
    }

    if (ctrl.data && !ctrl.data.reward.details.length) {
        ctrl.addPurchaseCondition();
    }

    function roundPercentage(dataIndex) {
        if (ctrl.data.reward.details[dataIndex].value) {
            ctrl.data.reward.details[dataIndex].value = parseFloat((Math.round(ctrl.data.reward.details[dataIndex].value * 100) / 100).toFixed(2));
        }
    }

    function getAllSegments() {
        var getCusSegmentPromise = customerSegmentDataService.getAllSegments();
        getCusSegmentPromise.then(
            function (data) {
                ctrl.segmentListfromWebservice = data.segments;
                var objearraySize = ctrl.segmentListfromWebservice.length;
                ctrl.segmentDetails = [];
                for (var i = 0; i < objearraySize; i++) {
                    var segment = {};
                    segment.name = ctrl.segmentListfromWebservice[i].name;
                    segment.id = ctrl.segmentListfromWebservice[i].id;

                    // If condition for Edit Customer Segment

                    if (ctrl.data.purchaseConds.customerSegmentId) {
                        if (ctrl.data.purchaseConds.customerSegmentId == ctrl.segmentListfromWebservice[i].id) {
                            ctrl.data.custSegment = segment;
                        }
                    } else {
                        ctrl.data.purchaseConds.customerSegmentId = 0;
                    }
                    ctrl.segmentDetails.push(segment);
                }
            },
            function () {
                // Should we have some error handling logic here?
            }
        );

    }
    function onSegmentSelection() {
        if (ctrl.data.custSegment) {
            ctrl.data.purchaseConds.customerSegmentId = ctrl.data.custSegment.id;
            if (ctrl.useCustSegReasonCode && ctrl.data.custSegment.id != 0) {
                ctrl.data.reward.reasonCode = 70;
            }
        } else {
            ctrl.data.reward.reasonCode = 49;
            ctrl.data.purchaseConds.customerSegmentId = 0;
        }
    }

    function initializePurchaseOption (index, item, data) {
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

    function showSkuTypeModal(ev, source, promostatus) {
        ctrl.source = source;
        ctrl.promostatus = promostatus;
        $mdDialog.show({
            template: '<sku-type-modal source="source" promo-status="promostatus"></sku-type-modal>',
            parent: angular.element(document.body),
            targetEvent: ev,
            scope: ctrl,
            preserveScope: true
        }).finally(function () {
            $rootScope.$broadcast('refreshSkuTypeValidations');
        });
    }

    function removeAll() {
        for (var i = 0; i < ctrl.data.purchaseConds.sources.length; i++) {
            ctrl.data.purchaseConds.sources[i].inclusions.partnumbers = [];
            ctrl.data.purchaseConds.sources[i].exclusions = {};
            ctrl.data.purchaseConds.sources[i].exclusions.attrs = {};
            ctrl.data.purchaseConds.sources[i].exclusions.initializeSkuTypeExclusions = true;
        }

        $rootScope.$broadcast('clearCategories');
    }

    var featureTogglePromise = featureFlagService.getFeatureFlags();
    featureTogglePromise.then(function (data) {
        ctrl.showBasketThreshold = data.basketThreshold;
        ctrl.useCustSegReasonCode = data.useCustSegReasonCode;
    })

}
