app.component('adminFooter', {
    bindings: {
        data: '=',
        previewdata: '=',
        previewOverlayConfig: '=',
        promoForm: '=',
        index: '=',
        formHolder: '=',
        validationErrors: '='
    },


    templateUrl: 'adminFooter.html',
    controller: function FooterCtrl(PromotionData, utilService, leadTimeService, promotionDataService, modalService, validationService, $scope) {
        var tempData = $.extend(true, {}, this.data);
        var inprogress = false;
        var isEndDtWithinLeadTime = false;
        var ctrl=this;
        if (tempData) {
            var isEndDtWithinLeadTimePromise = utilService.isSubmitEligibleForDisable(tempData);
            isEndDtWithinLeadTimePromise.then(function (value) {
                isEndDtWithinLeadTime = value;
            })
        }

        this.cancel = function () {
            this.data = $.extend(true, {}, tempData);
        }
        this.saveDraft = function (data) {
            tempData = $.extend(true, {}, data);

            if (tempData.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
                tempData.promoSubTypeCd = 'ProductLevelPerItemPercentDiscount';
            }

            utilService.setDefaultsForSaveAsDraft(tempData);
            utilService.transformPromotionRequest(tempData);

            var missing = utilService.requiredFieldsMissing(data);
            if (missing) {
                modalService.showAlert('Error', 'Valid Name,Type,Start Date,End Date are required');
                return;
            }
            var invalidCode = utilService.invalidSysGenCode(data);
            if (invalidCode) {
                modalService.showAlert('Error', 'System generated code should have a minimum of 9 characters');
                return;
            }

            if (!this.formHolder.form.$valid) {
                modalService.showAlert('Error', 'Please fix all validation errors');
                return;
            }
            inprogress = true;
            var promise = promotionDataService.saveAsDraft(tempData);
            promise.then(
                function (data) {
                    inprogress = false;
                    if (data.data.promoId) {
                        modalService.savedAlert('Success', 'Discount saved-' + data.data.promoId);
                    }
                },
                function () {
                    inprogress = false;
                    modalService.showAlert('Error', 'Unable to save discount');
                }
            )
        }

        $scope.$on('unauth-error',function() {
            ctrl.previewOverlayConfig.close();
        });

        this.preview = function (data) {
            var areValidationErrorsPresent;
            this.validatePromotion(data, function (validationErrors) {
                areValidationErrorsPresent = validationService.areErrorsPresent(validationErrors);
            });

            if (areValidationErrorsPresent === true) {
                modalService.showAlert('Error', 'Please fix all validation errors');
                return;
            }
            this.previewdata.data = $.extend(true, {}, data);
            this.previewOverlayConfig.open();
        }
        this.canSave = function (promotion) {
            return utilService.canSaveAsDraft(promotion) && !inprogress;
        }

        this.canApprove = function (promotion) {
            return utilService.canApprove(promotion) && !inprogress && !isEndDtWithinLeadTime;
        }

        this.isPreviewSubmitClickDisabled = function (promotion) {
            return utilService.isPreviewSubmitClickDisabled(promotion);
        }

        this.validatePromotion = function (promotion, callback) {
            var validationErrors = validationService.validatePromotion(promotion, true);
            callback(validationErrors);
        }

        this.disableClick = function (promotion) {
            var isClickable = utilService.canApprove(promotion) && !utilService.isPreviewSubmitClickDisabled(promotion);
            if (isClickable) {
                this.preview(this.data)
            }
            return isClickable;
        }


    }
});
