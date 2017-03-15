app.component('adminFooter', {
    bindings: {
        data: '=',
        previewdata: '=',
        previewOverlayConfig: '=',
        promoForm: '=',
        index: '=',
        formHolder: '='
    },
    templateUrl: 'adminFooter.html',
    controller: function FooterCtrl(PromotionData, utilService, promotionDataService, modalService) {
        var tempData = $.extend(true, {}, this.data);
        var inprogress = false;
        this.cancel = function () {
            this.data = $.extend(true, {}, tempData);
        }
        this.saveDraft = function (data) {
            tempData = $.extend(true, {}, data);
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
            utilService.setDefaultsForSaveAsDraft(tempData);
            utilService.transformPromotionRequest(tempData);
            inprogress = true;
            var promise = promotionDataService.saveAsDraft(tempData);
            promise.then(
                function (data) {
                    inprogress = false;
                    if (data.data.promoId) {
                        modalService.savedAlert('Success', 'Promotion saved-' + data.data.promoId);
                    }
                },
                function (error) {
                    inprogress = false;
                    modalService.showAlert('Error', 'Unable to save promotion');
                }
            )
        }
        this.preview = function (data) {
            this.previewdata.data = $.extend(true, {}, data);
            this.previewOverlayConfig.open();
        }
        this.canSave = function (promotion) {
            return utilService.canSaveAsDraft(promotion) && !inprogress;
        }

        this.canApprove = function (promotion) {
            return utilService.canApprove(promotion) && !inprogress;
        }
    }
});
