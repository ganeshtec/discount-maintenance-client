// Purpose is to build promotion code spec.
/* eslint-disable */

app.component('properties', {
    templateUrl: 'properties.html',
    bindings: {
        data: '=',
        index: '=',
        preview: '=',
        isDisabled: '=',
        formHolder: '=',
        promoForm: '=',
        display: '=',
        viewProp: '=',
        promoMfa: '=',
        validationErrors: '='
    },
    controller: PropertiesController

});

function PropertiesController($mdDialog, promotionDataService, utilService, validationService, DataFactory, itemCategorySourceData, loginService, featureFlagService, sectionsIndex, $scope, $rootScope) {
    var ctrl = this;

    ctrl.$onInit = function () {
        if (ctrl.userType === 228) {
            ctrl.data.reward.method = ctrl.data.reward.method || 'INDVDLAFFECTEDITMS';
        }
        ctrl.sectionsIndex = sectionsIndex;
        ctrl.userType = loginService.getCurrentUserRole();
        ctrl.formHolder.form = ctrl.promoForm ? ctrl.promoForm : ctrl.formHolder.form;

        ctrl.showMaximumDiscount = false;
        ctrl.data.channelToggle = $rootScope.channelToggle;
        ctrl.singleSkuBulkFlag = $rootScope.singleSkuBulk;

        //Discount Template Options
        ctrl.discountTemplate = null;
        ctrl.discountTemplateOptions = [{id : 0, value: "None"}];
        if(ctrl.viewProp.displaySingleSkuBulk && ctrl.singleSkuBulkFlag){
            ctrl.discountTemplateOptions.push({id: 1, value: "Single Sku Bulk"});
        }
        ctrl.discountTemplateSelected = ctrl.discountTemplateOptions[0];

        if(ctrl.data.singleSkuBulk == 1){
            ctrl.discountTemplateSelected.id = 1;
        }

        if (!ctrl.data.exclsve) {
            ctrl.data.exclsve = 0;
        }

        if (!ctrl.data.singleSkuBulk) {
            ctrl.data.singleSkuBulk = 0;
        }

        var getPromotionPromise = promotionDataService.getPromotionSubTypes();

        getPromotionPromise.then(
            function (data) {
                DataFactory.promotionSubTypes = data.promotionSubTypes;
                ctrl.promotionSubTypes = DataFactory.promotionSubTypes;
                ctrl.setPromotionSubType();
            },
            function (error) {
                DataFactory.messageModal.message = error;
                DataFactory.messageModal.title = 'Error';
                $('#messageModal').popup();
            });
    };

    ctrl.templateSelection = function (){
        if(ctrl.discountTemplateSelected.id == 1){
            ctrl.showSingleSkuBulkModal();
        }else{
            ctrl.data.singleSkuBulk = 0;
            ctrl.data.printLabel = (ctrl.data.singleSkuBulk == 1);
        }
    };

    ctrl.setPromotionSubType = function (watch) {
        if (ctrl.promotionSubTypes && ctrl.data && ctrl.data.promoSubTypeCd) {
            $.each(ctrl.promotionSubTypes, function (i) {
                if (ctrl.promoMfa && !watch) {
                    if (ctrl.data.promoType == 'ORDERPROMO' && ctrl.data.promoSubTypeCd == 'OrderLevelPercentDiscount') {
                        ctrl.promoSubTypeObject = ctrl.promotionSubTypes[1];
                    }
                    else {
                        ctrl.promoSubTypeObject = ctrl.promotionSubTypes[0];
                    }
                } else {
                    if (ctrl.promotionSubTypes[i].promoSubTypeCd == ctrl.data.promoSubTypeCd) {
                        ctrl.promoSubTypeObject = ctrl.promotionSubTypes[i];
                    }
                }
            });
        }
        if (ctrl.promoSubTypeObject && ctrl.promoSubTypeObject.promoSubTypeObject) {
            ctrl.getSelectedSubTypes();
        }
    }

    ctrl.addSources = function () {
        ctrl.data.purchaseConds.sources.push(new itemCategorySourceData());
    }

    ctrl.toggleExclusive = function () {
        ctrl.data.exclsve = ctrl.data.exclsve == 1 ? 0 : 1;
    }

    ctrl.showSingleSkuBulkModal = function () {
        if(ctrl.data.singleSkuBulk == 0 && ctrl.singleSkuBulkModalCheck()){
            $mdDialog.show({
                template: '<single-sku-bulk-modal data="$ctrl.data" template ="$ctrl.discountTemplateSelected" single-sku-bulk-clean-up="$ctrl.toggleSingleSkuBulk()" ng-if="$ctrl.singleSkuBulkFlag"><single-sku-bulk-modal>',
                parent: angular.element(document.body),
                targetEvent: null,
                scope: $scope,
                preserveScope: true
            })
        } else {
            ctrl.toggleSingleSkuBulk();
        }
    };

    ctrl.singleSkuBulkModalCheck = function () {
        if(ctrl.data.locationType == 'stores' || ctrl.data.labelText || ctrl.data.exclsve == 1 || ctrl.data.segment || ctrl.data.endDt
            || ctrl.data.startDt || ctrl.data.checkRapidPass || ctrl.data.purchaseConds.qualUOM != 'Quantity' || ctrl.data.reward.type != 'PERCNTOFF'){
            return true;
        } else{
            return false;
        }
    }

    ctrl.toggleSingleSkuBulk = function () {
        ctrl.data.singleSkuBulk = ctrl.data.singleSkuBulk == 1 ? 0 : 1;
        ctrl.data.exclsve = 0;

        //Rapidpass scenario for Single SkuBulk
        ctrl.data.checkRapidPass = false;
        ctrl.data.promoCdSpec = null;
        ctrl.data.promoCdRqrd = false;

        //Customer Segment scenario for Single SkuBulk
        ctrl.data.segment = null;
        ctrl.data.purchaseConds.customerSegmentId = 0;
        ctrl.data.purchaseConds.program = null;
        ctrl.data.purchaseConds.basketThreshold = null;

        //Location types scenario for Single SkuBulk
        ctrl.data.locationType = 'markets';

        //Print labels scenario for Single SkuBulk
        ctrl.data.printLabel = (ctrl.data.singleSkuBulk == 1);
        ctrl.data.labelText = '';
        ctrl.data.receiptDesc = '';
        ctrl.data.receiptHeader = '';


        //Clear dates for singleSkuBulk
        ctrl.data.startDt = undefined;
        ctrl.data.endDt = undefined;
        ctrl.data.endDtFormatted = undefined;
        ctrl.data.endDateSelection = false;

        $rootScope.$broadcast('clearSingleSkuBulk');
    }

    ctrl.validatePromotion = function () {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    };

    ctrl.resetRewardsOnPromoTypeChange = function () {
        // This removes all but the first reward when switching to "Buy A and B" promotions
        if (ctrl.data.reward.details.length > 1
            && (ctrl.data.promoSubTypeCd == 'MultipleItemsPercentDiscount'
            || ctrl.data.promoSubTypeCd == 'MultipleItemsValueDiscount')) {
            ctrl.data.reward.details.splice(1, ctrl.data.reward.details.length - 1);
        }
        if (ctrl.data.reward.type === 'AMTOFF') {
            ctrl.data.reward.details[0].maxAllowedVal = undefined;
        }
    }

    ctrl.getSelectedSubTypes = function () {
        if (ctrl.promoSubTypeObject !== null) {
            ctrl.data.promoSubTypeCd = ctrl.promoSubTypeObject.promoSubTypeCd;
            ctrl.data.promoSubTypeDesc = ctrl.promoSubTypeObject.promoSubTypeDesc;
            ctrl.data.promoType = ctrl.promoSubTypeObject.promoType;
        } else {
            ctrl.data.promoSubTypeCd = '';
            ctrl.data.promoSubTypeDesc = '';
            ctrl.data.promoType = '';
        }

        //Buy A And B, get % off both
        if (ctrl.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1 || ctrl.data.promoSubTypeCd.indexOf('MultipleItemsValueDiscount') != -1) {
            ctrl.data.isSitewideDeal = false;
            ctrl.data.reward.type = (ctrl.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1) ? 'PERCNTOFF' : 'AMTOFF';
            if (ctrl.data.purchaseConds.sources.length <= 1) {
                ctrl.addSources();
            }
        } else {

            ctrl.data.purchaseConds.sources.splice(1, 1);
        }

        if (ctrl.data.promoSubTypeCd.indexOf('Percent') != -1) {
            ctrl.data.reward.type = 'PERCNTOFF';
        } else {
            ctrl.data.reward.type = 'AMTOFF';
        }

        if (ctrl.data.promoType === 'ORDERPROMO') {
            if (ctrl.data.shortDesc || ctrl.data.longDesc) {
                DataFactory.messageModal.message = 'Short Description and Long Description were removed!';
                DataFactory.messageModal.title = 'Warning';
                $('#messageModal').popup();
                ctrl.data.shortDesc = '';
                ctrl.data.longDesc = '';
            }
            ctrl.data.reward.method = 'WHOLEORDER';
        } else {
            ctrl.data.reward.method = utilService.rewardMethodMapping[ctrl.data.promoSubTypeCd];
        }
    };

    ctrl.validatePromotion = function () {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    };

    $scope.$watch('$ctrl.data.promoSubTypeCd', function (model, oldModel) {
        if (model !== oldModel && !model)
            ctrl.setPromotionSubType(true);
    }, true);

    $scope.$watch('$ctrl.promotionSubTypes', function (model, oldModel) {
        if (model !== oldModel && !model)
            ctrl.setPromotionSubType();
    }, true);

    $scope.$watch('$ctrl.data.promoCdRqrd', function (model, oldModel) {
        if (model !== oldModel && !model) {
            delete ctrl.data.promoCdSpec;
        }
    });

}
