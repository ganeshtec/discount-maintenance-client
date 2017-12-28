// Purpose is to popuplate the modal with a message.
// Has control to close the modal
app.directive('promotionPreview', ['URL_CONFIG', 'promotionDataService', 'OverlayConfigFactory', 'DataFactory', 'utilService', 'validationService', '$cookies',
    function (URL_CONFIG, promotionDataService, overlayConfig, DataFactory, utilService, validationService, $cookies) {
        return {
            restrict: 'E',
            templateUrl: 'promotionPreview.html',
            scope: {
                data: '=',
                previewData: '=',
                previewOverlayConfig: '=',
                promoForm: '=',
                formHolder: '=',
                viewProp: '=',
                promoMfa: '=',
                validationErrors: '='
            },
            link: function (scope, element) {
                scope.convertDateStringToDate = function (dateString) {
                    return dateString ? moment(dateString).startOf('date').toDate() : undefined;
                }
                scope.validationErrors = validationService.validatePromotion(scope.data);
                scope.close = function () {
                    // if a exisiting promotion is submitted then reload the page
                    if (scope.originalPromoId && scope.savedPromoId) {
                        window.location.reload();
                    }
                    //if it was a new promotion  move to edit mode
                    if (scope.savedPromoId && !scope.originalPromoId) {
                        window.location = '#/discount-admin/' + scope.savedPromoId;

                    }
                    scope.previewOverlayConfig.close();
                }
                var setError = function (msg) {
                    scope.headerErrorMsg = msg;
                }

                if ($cookies.get('currentUserRole') != null) {
                    var currentUserRole = $cookies.get('currentUserRole');
                    scope.userType = parseInt(currentUserRole);
                }

                scope.saveAndSubmit = function (event) {
                    var unclickableSaveBtn = function (event) {
                        event.handleObj.handler = function () { };
                    }

                    var clickableSaveBtn = function (event) {
                        event.handleObj.handler = function () {
                            scope.saveAndSubmit(event);
                        }
                    }

                    unclickableSaveBtn(event);

                    scope.headerErrorMsg = '';
                    delete scope.errorMessages;

                    if (scope.userType === 229 && scope.previewData.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscount') {
                        scope.previewData.data.reward.reasonCode = 49;
                    }
                    else if (scope.userType === 229 && scope.previewData.data.promoSubTypeCd == 'OrderLevelPercentDiscount') {
                        scope.previewData.data.reward.reasonCode = 70;
                    }
                    else if (scope.userType === 228) {
                        if (scope.previewData.data.reward.reasonCode != 70) {
                            scope.previewData.data.reward.reasonCode = 49;
                        }
                        scope.previewData.data.promoSubTypeCd = 'TypeLessDiscount';
                        scope.previewData.data.promoSubTypeDesc = 'TypeLess-Discounts';
                        // scope.previewData.data.promoType = 'ITEMPROMO';
                    }

                    var promotion = $.extend(true, {}, scope.previewData.data);
                    //var promotion = scope.previewData.data;
                    utilService.setDefaultsForSaveAsDraft(promotion);
                    utilService.transformPromotionRequest(promotion);
                    var missingLocation = utilService.requiredLocationsOrMarkets(promotion);
                    var missing = utilService.requiredFieldsMissing(promotion);
                    var isBuyAandBHasSource = utilService.validateBuyAandB(promotion);
                    var isBuyAandBHasOverlap = utilService.validateBuyAandBOverlap(promotion);
                    if (!scope.originalSet) {
                        scope.originalPromoId = promotion.promoId;
                        scope.originalSet = true;
                    }
                    if (missing || missingLocation) {
                        setError('ERROR: Please fill out all required fields.');
                        return;
                    } else if (isBuyAandBHasSource != null) {
                        setError(isBuyAandBHasSource);
                        return;
                    } else if (isBuyAandBHasOverlap != null) {
                        setError(isBuyAandBHasOverlap);
                        return;
                    } else {
                        scope.requiredFieldsMissing = false;
                    }
                    var invalidSysCode = utilService.invalidSysGenCode(promotion);
                    if (invalidSysCode) {
                        setError('System generated code should have a minimum of 9 characters');
                        return;
                    }


                    if (!scope.formHolder.form.$valid) {
                        setError('ERROR: Please fix all validation errors.');
                        return;
                    }
                    var needsValidation = utilService.needsValidation(promotion);
                    scope.submitStatus = 'Saving as draft';
                    var save = function () {
                        var promise = promotionDataService.saveAsDraft(promotion);
                        promise.then(
                            function (data) {
                                if (data.data.promoId) {
                                    scope.submitStatus = 'Submitting promotion';
                                    scope.savedPromoId = data.data.promoId;
                                    scope.previewData.data.promoId = data.data.promoId;
                                    scope.submit(scope.previewData.data).then(
                                        function () {
                                            clickableSaveBtn(event);
                                        },
                                        function () {
                                            unclickableSaveBtn(event);
                                        });
                                }
                            },
                            function () {
                                scope.submitStatus = '';
                                setError('ERROR: Unable to submit promotion.');
                            }
                        )
                    }
                    if (needsValidation) {
                        var validatePromise = promotionDataService.validate(promotion);
                        scope.submitStatus = 'Validating promotion';
                        validatePromise.then(function () {
                            save();
                        }, function (res) {
                            var data = res.data;
                            if (data && data.validationErrorDetail) {
                                var errorData = data.validationErrorDetail.promotionValidationErrors;
                                var promoId = Object.keys(errorData)[0];
                                promotion.promotionId = promoId;
                                scope.errorMessages = errorData[promoId];
                            }
                            scope.submitStatus = '';
                            setError('ERROR: Unable to submit promotion.');
                        });
                    } else {
                        save();
                    }

                }


                scope.submit = function (promotionData) {
                    var promotion = $.extend(true, {}, promotionData);
                    if (promotion.status == 20 && promotion.promoSubTypeCd == 20 &&
                        promotion.promoTypeCd == 10) {
                        promotion.errorMessage = 'ERROR: Unable to Submit Promotion with Draft Default Values';
                    } else {
                        promotion.status = 1;
                        utilService.transformPromotionRequest(promotion);
                        var promise = promotionDataService.submit(promotion);
                        promise.then(
                            function () {
                                scope.submitStatus = '';
                                scope.previewOverlayConfig.close();
                                window.location = '#/discount-dashboard';
                            },
                            function (res) {
                                scope.submitStatus = '';
                                var data = res.data
                                if (data && data.validationErrorDetail) {
                                    var errorData = data.validationErrorDetail.promotionValidationErrors;
                                    var promoId = Object.keys(errorData)[0];
                                    promotion.promotionId = promoId;
                                    scope.errorMessages = errorData[promoId];
                                } else {
                                    scope.errorMessages = [];
                                }
                                var err = 'ERROR: Unable to submit promotion.';
                                if (!scope.originalPromoId && scope.savedPromoId) {
                                    err = err + 'The promotion is saved -' + scope.savedPromoId;
                                }
                                setError(err);
                                var content = element.find('.Popup_content');
                                content[0].scrollTop = '0px';
                            }
                        );
                    }

                    return promise;
                }
            }
        };
    }]);
