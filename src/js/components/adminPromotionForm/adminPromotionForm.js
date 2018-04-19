// Purpose is to build promotion data
app.component('adminPromotionForm', {
    templateUrl: 'adminPromotionForm.html',
    bindings: {
        data: '=',
        index: '=',
        preview: '@',
        isDisabled: '=',
        formHolder: '=',
        promoForm: '=',
        display: '=',
        viewProp: '=',
        promoMfa: '=',
        validationErrors: '='
    },
    controller: adminPromotionFormController

});

function adminPromotionFormController(promotionSubTypes, promotionDataService, redemptionMethodTypes, utilService, validationService, DataFactory, itemCategorySourceData, loginService, featureFlagService, sectionsIndex, $scope) {
    var ctrl = this;
    ctrl.sectionsIndex = sectionsIndex;
    ctrl.userType = loginService.getCurrentUserRole();
    ctrl.formHolder.form = ctrl.promoForm ? ctrl.promoForm : ctrl.formHolder.form;
    ctrl.showMaximumDiscount = false;
    // ctrl.promotionSubTypes = null;

    if (!ctrl.data.exclsve) {
        ctrl.data.exclsve = 0;
    }

    if (!ctrl.data.singleSkuBulk) {
        ctrl.data.singleSkuBulk = 0;
    }

    var featureFlagPromise = featureFlagService.getFeatureFlags();
    featureFlagPromise.then(function (res) {
        ctrl.data.channelToggle = res.channelSelect;
        ctrl.data.singleSkuBulkFlag = res.singleSkuBulk;
    })

    ctrl.$onInit = function () {
        var getPromotionPromise;

        getPromotionPromise = promotionDataService.getPromotionSubTypes();

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
    }
    //ctrl.getPromoSubTypes();

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

    $scope.$watch('ctrl.data.promoSubTypeCd', function (model, oldModel) {
        if (model !== oldModel && !model)
            ctrl.setPromotionSubType(true);
    }, true);

    $scope.$watch('ctrl.promotionSubTypes', function (model, oldModel) {
        if (model !== oldModel && !model)
            ctrl.setPromotionSubType();
    }, true);

    $scope.$watch('ctrl.data.promoCdRqrd', function (model, oldModel) {
        if (model !== oldModel && !model) {
            delete ctrl.data.promoCdSpec;
        }
    });

    ctrl.addSources = function () {
        ctrl.data.purchaseConds.sources.push(new itemCategorySourceData());
    }

    ctrl.toggleExclusive = function () {
        ctrl.data.exclsve = ctrl.data.exclsve == 1 ? 0 : 1;
    }

    ctrl.toggleSingleSkuBulk = function () {
        ctrl.data.singleSkuBulk = ctrl.data.singleSkuBulk == 1 ? 0 : 1;
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

        //AP-573-Promo validations - Buy A And B, get % off both
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
    }

    if (ctrl.userType === 228) {
        ctrl.data.reward.method = ctrl.data.reward.method || 'INDVDLAFFECTEDITMS';
    }

    ctrl.validatePromotion = function () {
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    }

    // redemption method types
    ctrl.redemptionMethodTypes = new redemptionMethodTypes();


}
