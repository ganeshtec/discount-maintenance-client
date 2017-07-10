// Purpose is to build promotion data
app.directive('adminPromotionForm', ['promotionSubTypes', 'promotionDataService', 'redemptionMethodTypes', 'validationService','DataFactory', 'itemCategorySourceData',
    function (promotionSubTypes, promotionDataService, redemptionMethodTypes, validationService, DataFactory, itemCategorySourceData) {

        return {
            restrict: 'E',
            templateUrl: 'adminPromotionForm.html',
            scope: {
                data: '=',
                index: '=',
                preview: '@',
                isDisabled: '=',
                formHolder: '=',
                display: '=',
                viewProp: '=',
                promoMfa: '=',
                validationErrors: '='
            },
            link: function (scope) {
             //console.log("--------scope.data in AdminPromoForm:----",scope.data.purchaseConds);
                // if(scope.data.purchaseConds.locations.flag=='storeFlag') {
                //     scope.data.purchaseConds.locations.locations='stores'
                // }
             
                // else{
                //     scope.data.purchaseConds.locations.locations='markets'
                // }
                function getPromoSubTypes() {
                    var getPromotionPromise;
                    if (scope.promoMfa) {
                        DataFactory.promotionSubTypes = promotionDataService.getPromotionSubTypesForMFA();
                        scope.promotionSubTypes = DataFactory.promotionSubTypes;
                    }
                    else {
                        getPromotionPromise = promotionDataService.getPromotionSubTypes();

                        getPromotionPromise.then(
                            function (data) {
                                DataFactory.promotionSubTypes = data.promotionSubTypes;
                                scope.promotionSubTypes = DataFactory.promotionSubTypes;
                            },
                            function (error) {
                                DataFactory.messageModal.message = error;
                                DataFactory.messageModal.title = 'Error';
                                $('#messageModal').popup();

                            });
                    }
                }


                scope.formHolder.form = scope.promoForm;
                getPromoSubTypes();

                function setPromotionSubType(watch) {
                    if (scope.promotionSubTypes && scope.data && scope.data.promoSubTypeCd) {
                        $.each(scope.promotionSubTypes, function (i) {
                            if (scope.promoMfa &&  !watch) {
                                if (scope.data.promoType=='ORDERPROMO' && scope.data.promoSubTypeCd=='OrderLevelPercentDiscount') {
                                    scope.promoSubTypeObject = scope.promotionSubTypes[1];
                                }
                                else {
                                    scope.promoSubTypeObject = scope.promotionSubTypes[0];
                                }
                            } else {
                                if (scope.promotionSubTypes[i].promoSubTypeCd == scope.data.promoSubTypeCd) {
                                    scope.promoSubTypeObject = scope.promotionSubTypes[i];
                                }
                            }
                        });
                    }
                }
                scope.$watch('data.promoSubTypeCd', function () {
                    setPromotionSubType(true);
                    if (scope.promoSubTypeObject && scope.promoSubTypeObject.promoSubTypeObject) {
                        scope.getSelectedSubTypes();
                    }
                });
                scope.$watch('promotionSubTypes', function () {
                    setPromotionSubType();
                    if (scope.promoSubTypeObject && scope.promoSubTypeObject.promoSubTypeObject) {
                        scope.getSelectedSubTypes();
                    }
                });
                scope.$watch('data.promoCdRqrd', function (model, oldModel) {
                    if (model !== oldModel && !model) {
                        delete scope.data.promoCdSpec;
                    }
                });
                function addSources() {
                    scope.data.purchaseConds.sources.push(new itemCategorySourceData());
                }

                scope.validatePromotion = function(){
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                };

                scope.resetRewardsOnPromoTypeChange = function() {
                    // This removes all but the first reward when switching to "Buy A and B" promotions
                    if(scope.data.reward.details.length > 1
                        && (scope.data.promoSubTypeCd == 'MultipleItemsPercentDiscount' 
                        || scope.data.promoSubTypeCd == 'MultipleItemsValueDiscount')) { 
                        scope.data.reward.details.splice(1, scope.data.reward.details.length-1);
                    }
                }

                scope.showMaximumDiscount = false;

                scope.getSelectedSubTypes = function () {

                    

                    if (scope.promoSubTypeObject.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
                        scope.data.purchaseConds.customerSegmentId = 0;
                    }
                    scope.data.promoSubTypeCd = scope.promoSubTypeObject.promoSubTypeCd;
                    scope.data.promoSubTypeDesc = scope.promoSubTypeObject.promoSubTypeDesc;
                    scope.data.promoType = scope.promoSubTypeObject.promoType;

                    if (scope.promoSubTypeObject.promoSubTypeCd == 'OrderLevelPercentDiscount') {
                        scope.data.printLabel = false;
                    }
                    else{
                        scope.data.printLabel = true;
                    }


                    //AP-573-Promo validations - Buy A And B, get % off both
                    if (scope.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1 || scope.data.promoSubTypeCd.indexOf('MultipleItemsValueDiscount') != -1) {
                        scope.data.isSitewideDeal = false;
                        scope.data.reward.type = (scope.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1) ? 'PERCNTOFF' : 'AMTOFF';
                        if (scope.data.purchaseConds.sources.length <= 1) {
                            addSources();
                        }
                    } else {
                        scope.data.purchaseConds.sources.splice(1, 1);
                    }

                    if (scope.data.promoSubTypeCd.indexOf('Percent') != -1) {
                        scope.data.reward.type = 'PERCNTOFF';
                    } else {
                        scope.data.reward.type = 'AMTOFF';
                    }

                    if (scope.data.promoType === 'ORDERPROMO') {
                        if (scope.data.shortDesc || scope.data.longDesc) {
                            DataFactory.messageModal.message = 'Short Description and Long Description were removed!';
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                            scope.data.shortDesc = '';
                            scope.data.longDesc = '';
                        }
                        scope.data.reward.method = 'WHOLEORDER';
                    }
                }

                scope.validatePromotion = function() {
                    scope.validationErrors = validationService.validatePromotion(scope.data);
                }

                // redemption method types
                scope.redemptionMethodTypes = new redemptionMethodTypes();

            }
        };
    }]);
