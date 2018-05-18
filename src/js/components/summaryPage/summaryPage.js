// Summary Page Component
app.component('summaryPage', {
    templateUrl: 'summaryPage.html',
    bindings: {
        data: '=',
        promoForm: '=',
        formHolder: '=',
        viewProp: '=',
        promoMfa: '=',
        validationErrors: '='
    },
    controller: summaryPageController

});

function summaryPageController(promotionDataService, utilService, validationService, loginService, $rootScope, modalService) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.displayCustomerSegmentInDCM = $rootScope.displayCustomerSegmentInDCM;
        ctrl.formHolder.form = ctrl.promoForm ? ctrl.promoForm : ctrl.formHolder.form;
        ctrl.userType = loginService.getCurrentUserRole();
        ctrl.validationErrors = validationService.validatePromotion(ctrl.data);
    }
    ctrl.joinLocations = function () {
        var locationType;
        var locations;
        if (ctrl.data.purchaseConds.markets.length > 0) {
            locationType = ' Markets ';
            locations = ctrl.data.markets.map(function (market) { return market.marketNumber + ' - ' + market.marketName }).join(' , ');
        } else if (ctrl.data.purchaseConds.locations.length > 0) {
            locationType = ' Stores ';
            locations = ctrl.data.stores.map(function (store) { return store.storeNumber + ' - ' + store.storeName }).join(' , ');
        } else {
            locationType = '';
            locations = 'None';
        }
        return locationType + locations;
    }

    ctrl.joinChannels = function () {
        if( ctrl.data.channelsWithCheckedFields) {
            return ctrl.data.channelsWithCheckedFields.filter( function(channel) {
                return ctrl.data.channels.includes(channel.id);
            }).map(function(channel) {
                return channel.name;
            }).join(' , ')
        }
    }

    ctrl.formatDate = function (date) {
        if(date === undefined){
            return ('None')
        }
        return moment(date).format('MM-DD-YYYY')
    }

    // Set Error Message
    var setError = function (msg) {
        ctrl.headerErrorMsg = msg;
    }

    // Save and Submit In Summary

    ctrl.saveAndSubmit = function () {
        // var unclickableSaveBtn = function (event) {
        //     event.handleObj.handler = function () { };
        // }

        // var clickableSaveBtn = function (event) {
        //     event.handleObj.handler = function () {
        //         ctrl.saveAndSubmit(event);
        //     }
        // }

        //unclickableSaveBtn(event);

        ctrl.headerErrorMsg = '';
        delete ctrl.errorMessages;
        if (ctrl.userType === 229) {
            ctrl.data.purchaseConds.channels = [57];
        }

        if (ctrl.userType === 228) {
            ctrl.data.purchaseConds.channels = ctrl.data.channels;
            ctrl.data.promoSubTypeCd = 'TypeLessDiscount';
            ctrl.data.promoSubTypeDesc = 'TypeLess-Discounts';
        }
        if (ctrl.data.checkRapidPass) {
            ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = ctrl.data.promoCdSpec.systemGen.uniqueCdCnt;
            ctrl.data.redmptnLmt.maxUsesOfPromo = ctrl.data.promoCdSpec.systemGen.uniqueCdCnt;
        }
        var promotion = $.extend(true, {}, ctrl.data);
        
        utilService.setDefaultsForSaveAsDraft(promotion);
        utilService.transformPromotionRequest(promotion);


        var missingLocation = utilService.requiredLocationsOrMarkets(promotion);
        var missing = utilService.requiredFieldsMissing(promotion);
        var rapidPassSegCheck = utilService.requiredRapidPassCheck(promotion);
        var isBuyAandBHasSource = utilService.validateBuyAandB(promotion);
        var isBuyAandBHasOverlap = utilService.validateBuyAandBOverlap(promotion);

        var validationErrors = ctrl.validatePromotion(ctrl.data);
        if(validationService.areErrorsPresent(validationErrors)) {
            modalService.showDialog('Error! Please fix all validation errors', validationService.getErrorMessages(validationErrors));
            return;
        }
        if (!ctrl.originalSet) {
            ctrl.originalPromoId = promotion.promoId;
            ctrl.originalSet = true;
        }
        if (missing || missingLocation || rapidPassSegCheck) {
            setError('ERROR: Please fill out all required fields.');
            return;
        } else if (isBuyAandBHasSource != null) {
            setError(isBuyAandBHasSource);
            return;
        } else if (isBuyAandBHasOverlap != null) {
            setError(isBuyAandBHasOverlap);
            return;
        } else if (ctrl.userType === 228 && ctrl.data.purchaseConds.channels != null && ctrl.data.purchaseConds.channels.length <= 0) {
            setError('ERROR: Please select at least one selling channel');
            return;
        } else if (ctrl.data.purchaseConds.program != null && $rootScope.programIdForProMonthly.split(',').indexOf(ctrl.data.purchaseConds.program.id.toString()) > -1 && ctrl.data.purchaseConds.program.proPaint === null) {
            setError('ERROR: Please select the appropriate ProPaint field');
            return;
        } else {
            ctrl.requiredFieldsMissing = false;
        }
        var invalidSysCode = utilService.invalidSysGenCode(promotion);
        if (invalidSysCode) {
            setError('System generated code should have a minimum of 9 characters');
            return;
        }


        if (!ctrl.formHolder.form.$valid) {
            setError('ERROR: Please fix all validation errors.');
            return;
        }
        var needsValidation = utilService.needsValidation(promotion);
        ctrl.submitStatus = 'Saving as draft';
        var save = function () {
            var promise = promotionDataService.saveAsDraft(promotion);
            promise.then(
                function (data) {
                    if (data.data.promoId) {
                        ctrl.submitStatus = 'Submitting promotion';
                        ctrl.savedPromoId = data.data.promoId;
                        ctrl.data.promoId = data.data.promoId;
                        ctrl.submit(ctrl.data).then(
                            function () {
                        //        clickableSaveBtn(event);
                            },
                            function () {
                               // unclickableSaveBtn(event);
                            });
                    }
                },
                function () {
                    ctrl.submitStatus = '';
                    setError('ERROR: Unable to submit promotion.');
                }
            )
        }
        if (needsValidation) {
            var validatePromise = promotionDataService.validate(promotion);
            ctrl.submitStatus = 'Validating promotion';
            validatePromise.then(function () {
                save();
            }, function (res) {
                var data = res.data;
                if (data && data.validationErrorDetail) {
                    var errorData = data.validationErrorDetail.promotionValidationErrors;
                    var promoId = Object.keys(errorData)[0];
                    promotion.promotionId = promoId;
                    ctrl.errorMessages = errorData[promoId];
                }
                ctrl.submitStatus = '';
                setError('ERROR: Unable to submit promotion.');
            });
        } else {
            save();
        }

    }
    //  Submit function
    ctrl.submit = function (promotionData) {
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
                    ctrl.submitStatus = '';
                    window.location = '#/discount-dashboard';
                },
                function (res) {
                    ctrl.submitStatus = '';
                    var data = res.data
                    if (data && data.validationErrorDetail) {
                        var errorData = data.validationErrorDetail.promotionValidationErrors;
                        var promoId = Object.keys(errorData)[0];
                        promotion.promotionId = promoId;
                        ctrl.errorMessages = errorData[promoId];
                    } else {
                        ctrl.errorMessages = [];
                    }
                    var err = 'ERROR: Unable to submit promotion.';
                    if (!ctrl.originalPromoId && ctrl.savedPromoId) {
                        err = err + 'The promotion is saved -' + ctrl.savedPromoId;
                    }
                    setError(err);
                    // var content = element.find('.Popup_content');
                    // content[0].scrollTop = '0px';
                }
            );
        }

        return promise;
    }

    ctrl.isSubmitDisabled = function(promotion) {
        return !utilService.canApprove(promotion) || utilService.isPreviewSubmitClickDisabled(promotion);
    }

    ctrl.validatePromotion = function (promotion) {
        var validationErrors = null;
        if (!ctrl.isSubmitDisabled(promotion)) {
            validationErrors = validationService.validatePromotion(promotion, true);
        }
        return validationErrors;
    }

}
