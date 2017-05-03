/* 
	Validation Service 
	Services that will handle validation of promotion attributes
*/

app.service('validationService', ['$filter', 'leadTimeService', function ($filter, leadTimeService) {
    var publicApi = {};

    publicApi.validateStartDate = function (startDt) {
        var startDateErrors = {
            isError: false,
            message: ''
        };

        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (startDt < today && startDt) {
            startDateErrors.isError = true;
            startDateErrors.message = 'Start date cannot be earlier than today.';
        }

        return startDateErrors;
    }

    publicApi.validateEndDate = function (startDt, endDt) {
        var endDateError = {
            isError: false,
            message: ''
        };
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (endDt) {
            if (endDt < today) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be earlier than today.';
            } else if (endDt < startDt) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be before start date.';
            }
        }

        return endDateError;
    }

    publicApi.validateMSBEndDate = function (startDt, endDt) {
        console.log("MSB END DATE VALIDATION");
        var endDateError = {
            isError: false,
            message: ''
        };
        // var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        var leadTimePromise = leadTimeService.fetchLeadTime();
        leadTimePromise.then(function (leadTime) {
            var minEndDate = publicApi.getMinEndDate(startDt,leadTime);
            console.log('minEndDate', minEndDate);
            var isValid = publicApi.isEndDateValid(minEndDate, endDt);

            if (endDt < minEndDate) {
                
            }

            if (!isValid && endDt) {
                endDateError.isError = true;
                endDateError.message = 'Please enter a valid end date. Earliest possible MSB end date is ' + minEndDate + '.';
                // processErrorMessage(endDateError);
            }
            return endDateError;
        })
        return endDateError;
    }

    // publicApi.validateLeadTime = function (promoSubTypeCd, startDate, endDt,  processErrorMessage) {
    //     var endDtLeadTimeError = {
    //         isError: false,
    //         message: ''
    //     };

    //     if (promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
    //         var leadTimePromise = leadTimeService.fetchLeadTime();
    //         leadTimePromise.then(function (leadTime) {
    //             var minEndDate = publicApi.getMinEndDate(startDate,leadTime);
    //             var isValid = publicApi.isEndDateValid(minEndDate, endDt);
    //             if (!isValid && endDt) {
    //                 endDtLeadTimeError.isError = true;
    //                 endDtLeadTimeError.message = 'Please enter a valid end date. Earliest possible MSB end date is ' + minEndDate;
    //                 processErrorMessage(endDtLeadTimeError);
    //             }
    //             return endDtLeadTimeError;
    //         })
    //     }
    // }

    publicApi.getMinEndDate = function (startDt,leadTime) {
        var startDate = startDt ? new Date(startDt) : new Date();
        var minEndDate = $filter('date')(startDate.setDate(startDate.getDate() + leadTime), 'yyyy-MM-dd')
        return minEndDate;
    };

    publicApi.isEndDateValid = function (minDate, endDt) {
        if (endDt < minDate) {
            return false;
        } else {
            return true;
        }
    };


    publicApi.validateEndDtWithStartDt = function (startDt, endDt) {

        var endDtLessThanStartErr = {
            isError: false,
            message: ''
        };

        if (endDt < startDt) {
            endDtLessThanStartErr.isError = true;
            endDtLessThanStartErr.message = 'End date must be after Start date.'
        }

        return endDtLessThanStartErr;
    }

    publicApi.validateMinimumQty = function (rewards) {
        var minQtyErrObj;
        var minQtyErrors = [];

        for (var i = 0; i < rewards.length; i++) {

            if (rewards[i].min == 0) {
                minQtyErrObj = {
                    isError: true,
                    message: 'Zero is not valid'
                };
                minQtyErrors.push(minQtyErrObj);
            }

            else {
                minQtyErrObj = {
                    isError: false,
                    message: ''
                };
                minQtyErrors.push(minQtyErrObj);
            }

        }

        return minQtyErrors;

    }

    publicApi.validateMaxPercentage = function (rewards) {
        var maxPrctObj;
        var maxPercentageErrors = [];

        for (var i = 0; i < rewards.length; i++) {

            if ((rewards[i].value > 100 || rewards[i].value == 0)) {
                maxPrctObj = {
                    isError: true,
                    message: 'Please enter a value between 0.01 and 100'
                };
                maxPercentageErrors.push(maxPrctObj);
            }

            else {
                maxPrctObj = {
                    isError: false,
                    message: ''
                };
                maxPercentageErrors.push(maxPrctObj);
            }

        }

        return maxPercentageErrors;

    }

    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};

        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        // validationErrors.endDt = publicApi.validateEndDate(promotion.promoSubTypeCd, promotion.startDt, promotion.endDt);

        console.log('subtypecd:', promotion.promoSubTypeCd);

        validationErrors.endDt = promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB'
            ? publicApi.validateMSBEndDate(promotion.startDt, promotion.endDt)
            : publicApi.validateEndDate(promotion.startDt, promotion.endDt);

        // publicApi.validateLeadTime(promotion.promoSubTypeCd, promotion.startDt, promotion.endDt, function (errorMsg) {
        //     validationErrors.endDtLeadTime = errorMsg;
        // });
        // validationErrors.endDtLessStartDt = publicApi.validateEndDtWithStartDt(promotion.startDt, promotion.endDt);
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty(promotion.reward.details);
        validationErrors.maxPercentage = publicApi.validateMaxPercentage(promotion.reward.details);

        return validationErrors;
    }

    return publicApi;
}]);
