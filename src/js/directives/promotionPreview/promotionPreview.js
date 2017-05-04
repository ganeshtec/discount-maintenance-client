// Purpose is to popuplate the modal with a message.
// Has control to close the modal
app.directive('promotionPreview', ['URL_CONFIG', 'promotionDataService', 'OverlayConfigFactory', 'DataFactory', 'utilService',
    function (URL_CONFIG, promotionDataService, overlayConfig, DataFactory, utilService) {
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
              

            },
            link: function (scope, element) {



                scope.close = function () {
                    // if a exisiting promotion is submitted then reload the page
                    if (scope.originalPromoId && scope.savedPromoId) {
                        window.location.reload();
                    }
                    //if it was a new promotion  move to edit mode
                    if (scope.savedPromoId && !scope.originalPromoId) {
                        window.location = '#/promotion-admin/' + scope.savedPromoId;

                    }
                    scope.previewOverlayConfig.close();
                }
                var setError = function (msg) {
                    scope.headerErrorMsg = msg;
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
                    if (scope.previewData.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB' && scope.previewData.data.custSegment) {
                        delete scope.previewData.data.custSegment;
                        scope.previewData.data.purchaseConds.customerSegmentId = 0;
                    }
                    if (scope.previewData.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountCS' || scope.previewData.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
                        scope.previewData.data.promoSubTypeCd = 'ProductLevelPerItemPercentDiscount';
                    }

                    if(scope.previewData.data.promoSubTypeCd == 'ProductLevelPerItemPercentDiscount' && scope.previewData.data.custSegment) {
                    
                        scope.previewData.data.printLabel = false;
                    }
                    var promotion = scope.previewData.data;
                    utilService.setDefaultsForSaveAsDraft(promotion);
                    utilService.transformPromotionRequest(promotion);
                    var missing = utilService.requiredFieldsMissing(promotion);
                    var isBuyAandBHasSource = utilService.validateBuyAandB(promotion);
                    if (!scope.originalSet) {
                        scope.originalPromoId = promotion.promoId;
                        scope.originalSet = true;
                    }
                    if (missing) {
                        setError('ERROR: Please fill out all required fields.');
                        clickableSaveBtn(event);
                        return;
                    } else if (isBuyAandBHasSource != null) {
                        setError(isBuyAandBHasSource);
                        clickableSaveBtn(event);
                        return;
                    } else {
                        scope.requiredFieldsMissing = false;
                    }
                    var invalidSysCode = utilService.invalidSysGenCode(promotion);
                    if (invalidSysCode) {
                        setError('System generated code should have a minimum of 9 characters');
                        clickableSaveBtn(event);
                        return;
                    }


                    if (!scope.formHolder.form.$valid) {
                        setError('ERROR: Please fix all validation errors.');
                        clickableSaveBtn(event);
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
                                            clickableSaveBtn(event);
                                        });
                                }
                            },
                            function () {
                                scope.submitStatus = '';
                                setError('ERROR: Unable to submit promotion.');
                                clickableSaveBtn(event);
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
                            clickableSaveBtn(event);
                        });
                    } else {
                        save();
                    }

                }


                scope.submit = function (promotion) {
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
                                window.location = '#/promotion-dashboard';
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