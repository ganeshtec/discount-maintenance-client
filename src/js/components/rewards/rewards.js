app.component('rewards', {
    templateUrl: 'rewards.html',
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
    controller: rewardsController
});

rewardsController.$inject = ['$rootScope', '$scope', '$mdDialog', 'SourceData', 'validationService', 'utilService', 'loginService', 'featureFlagService'];

function rewardsController($rootScope, $scope, $mdDialog, SourceData, validationService, utilService, loginService) {
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
    ctrl.initializePurchaseOption = initializePurchaseOption;
    ctrl.setSingleSkuBulkDefault = setSingleSkuBulkDefault;
    ctrl.showSkuTypeModal = showSkuTypeModal;
    ctrl.removeAll = removeAll;
    ctrl.isMFAUser;
    ctrl.isDCMUser;
    ctrl.costPlusPercent = $rootScope.costPlusPercent;
    ctrl.rewardTypeLabel = 'Percentage';
    ctrl.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    ctrl.showBasketThreshold = $rootScope.showBasketThreshold;

    ctrl.$onInit = $onInit;
    ctrl.userType = loginService.getCurrentUserRole();

    function $onInit() {
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
            if (ctrl.data.reward && !ctrl.data.reward.type) {
                ctrl.data.reward.type = 'PERCNTOFF';
            }
            if (!ctrl.data.promoType) {
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
        switch (ctrl.data.reward.type) {
        case 'AMTOFF':
            rewardTypeLabel = 'Amount';
            break;
        case 'PERCNTOFF':
            rewardTypeLabel = 'Percentage Off';
            break;
        case 'COSTPLUSPERCNT':
            rewardTypeLabel = 'Initial Mark-Up (IMU)';
            break;
        }
        return rewardTypeLabel;
    }

    function setRewardMethod() {
        switch (ctrl.data.promoType) {
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
        ctrl.validatePromotion();
        ctrl.validationErrors.percentageWarning.isError = {};
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

    function initializePurchaseOption(index, item, data) {
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
        $scope.source = source;
        $scope.promostatus = promostatus;
        $mdDialog.show({
            template: '<sku-type-modal source="source" promo-status="promostatus"></sku-type-modal>',
            parent: angular.element(document.body),
            targetEvent: ev,
            scope: $scope,
            preserveScope: true
        }).finally(function () {
            $rootScope.$broadcast('refreshSkuTypeValidations');
        });
    }

    $scope.$watch('$ctrl.data.singleSkuBulk', function () {
        ctrl.setSingleSkuBulkDefault();
        ctrl.removeAll()
    })

    function setSingleSkuBulkDefault() {
        if (ctrl.data.singleSkuBulk) {
            ctrl.data.reward.type = 'PERCNTOFF';
            ctrl.qualuom = 'Quantity';
            ctrl.setQualUOM(ctrl.qualuom);
            ctrl.getRewardLabel();
        }
        ctrl.data.reward.details.splice(1, ctrl.data.reward.details.length);
        if (ctrl.data.reward.details.length == 1) {
            ctrl.data.reward.details[0].maxAllowedVal = null;
            ctrl.data.reward.details[0].value = null;
            ctrl.data.reward.details[0].min = null;
        }
    }

    function removeAll() {
        for (var i = 0; i < ctrl.data.purchaseConds.sources.length; i++) {
            ctrl.data.purchaseConds.sources[i].inclusions.partnumbers = [];
            ctrl.data.purchaseConds.sources[i].inclusions.validSkuInfo = [];
            ctrl.data.purchaseConds.sources[i].exclusions.validSkuInfo = [];
            ctrl.data.purchaseConds.sources[i].inclusions.validOmsInfo = [];
            ctrl.data.purchaseConds.sources[i].exclusions.validOmsInfo = [];
            ctrl.data.purchaseConds.sources[i].exclusions = {};
            ctrl.data.purchaseConds.sources[i].exclusions.attrs = {};
            ctrl.data.purchaseConds.sources[i].exclusions.initializeSkuTypeExclusions = true;
        }
        $rootScope.$broadcast('clearCategories');
    }
}
