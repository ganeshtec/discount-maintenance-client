/* 
	Validation Service 
	Services that will handle validation of promotion attributes
*/

app.service('validationService', ['$filter', 'utilService', '$cookies', function ($filter, utilService, $cookies) {
    var publicApi = {};

    var leadTime = null;

    //Get lead time and cache
    var leadTimePromise = utilService.getLeadTime();
    leadTimePromise.then(function (leadtime) {
        leadTime = leadtime;
    })

    if ($cookies.get('currentUserRole') != null) {
        var currentUserRole = $cookies.get('currentUserRole');
        this.userType = parseInt(currentUserRole);
    }

    publicApi.validateStartDate = function (promotion, checkForUndefined) {
        // Will skip validation of start date if the promotion is active

        if (utilService.isPromotionActive(promotion)) {
            return { isError: false, message: '' };
        }

        var startDateError = (promotion.startDt === undefined && checkForUndefined) ? {
            isError: true,
            message: 'Start date is requred.'
        } : {
            isError: false,
            message: ''
        };

        var today = moment();
        if (promotion.startDt && moment(promotion.startDt).isBefore(today, 'day')) {
            startDateError.isError = true;
            startDateError.message = 'Start date cannot be earlier than today.';
        }

        return startDateError;
    }

    publicApi.validateEndDateWithoutLeadTime = function (startDt, endDt, checkForUndefined) {
        var endDateError = (endDt === undefined && checkForUndefined) ? {
            isError: true,
            message: 'End date is requred.'
        } : {
            isError: false,
            message: ''
        };


        var today = moment();

        if (endDt) {
            if (moment(endDt).isBefore(startDt, 'day')) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be before start date.';
            } else if (moment(endDt).isBefore(today, 'day')) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be earlier than today.';
            }
        }

        return endDateError;
    }

    publicApi.validatePriority = function (priority) {
        var priorityErrors = {
            isError: false,
            message: ''
        };


        if (priority && (priority < 0 || priority > 1000 || priority % 1 != 0)) {
            priorityErrors.isError = true;
            priorityErrors.message = 'Enter number between 0 and 1000';
        }

        return priorityErrors;
    }

    publicApi.validateEndDateWithLeadTime = function (startDt, endDt, checkForUndefined) {
        var endDateError = (endDt == null && checkForUndefined) ? {
            isError: true,
            message: 'End date is requred.'
        } : {
            isError: false,
            message: ''
        };


        var minEndDate = publicApi.getMinEndDate(startDt, leadTime);

        if (endDt) {
            if (moment(endDt).isBefore(minEndDate, 'day')) {
                endDateError.isError = true;
                endDateError.message = 'Please enter a valid end date. Earliest possible MSB end date is ' + minEndDate.format('MM/DD/YYYY') + '.';
            }

        }

        return endDateError;
    }

    publicApi.getMinEndDate = function (startDt, leadTime) {
        var today = moment();
        var startDate = (startDt && today.isBefore(startDt, 'days')) ? moment(startDt) : today;
        var minEndDate = moment(startDate).add(leadTime, 'days');
        return minEndDate;
    };

    publicApi.validateThreeMonthsWarning = function (startDt) {
        var threeMonthsWarning = {
            isError: false,
            message: ''
        };

        if (moment(startDt).isAfter(moment().add(3, 'months'))) {
            threeMonthsWarning.isError = true;
            threeMonthsWarning.message = 'It will be at least three months until this discount begins.'
        }

        return threeMonthsWarning;
    }

    publicApi.validateMinimumPurchase = function (rewards, checkForUndefined) {
        var minQtyErrObj;
        var minQtyErrors = [];

        for (var i = 0; i < rewards.length; i++) {
            if (rewards[i].min === undefined && checkForUndefined === true) {
                minQtyErrObj = {
                    isError: true,
                    message: 'is required.'
                };
                minQtyErrors.push(minQtyErrObj);
            }
            // null and undefined checks are necessary here. I tried to check
            // "if (rewards[i].min)", but when the value is 0, it evaluates to falsey.
            else if (rewards[i].min != null
                && rewards[i].min != undefined
                && rewards[i].min <= 0) {
                minQtyErrObj = {
                    isError: true,
                    message: 'must be greater than zero.'
                };
                minQtyErrors.push(minQtyErrObj);
            } else {
                minQtyErrObj = {
                    isError: false,
                    message: ''
                };
                minQtyErrors.push(minQtyErrObj);
            }
        }
        return minQtyErrors;
    }

    publicApi.validateBasketThreshold = function (promotion) {
        var number = new Number(promotion.purchaseConds.basketThreshold);
        var rounded = number.toFixed(2);
        var floatRounded = parseFloat(rounded);
        promotion.purchaseConds.basketThreshold = floatRounded;
        promotion.purchaseConds.basketThreshold <= 0 ? promotion.purchaseConds.basketThreshold = null : promotion.purchaseConds.basketThreshold;
        return promotion;
    }

    publicApi.validatePercentOff = function (rewards, checkForUndefined) {
        var percentOffErrorObject;
        var percentOffErrors = [];

        for (var i = 0; i < rewards.length; i++) {
            if (rewards[i].value === undefined && checkForUndefined === true) {
                percentOffErrorObject = {
                    isError: true,
                    message: 'Percent off is required.'
                };
                percentOffErrors.push(percentOffErrorObject);
            }

            // null and undefined checks are necessary here. I tried to check
            // "if (rewards[i].value)", but when the value is 0, it evaluates to falsey.
            else if (rewards[i].value != null
                && rewards[i].value != undefined
                && (rewards[i].value > 99.9 || rewards[i].value < 0.01)) {

                percentOffErrorObject = {
                    isError: true,
                    message: 'Please enter a value between 0.01 and 99.9.'
                };
                percentOffErrors.push(percentOffErrorObject);
            }

            else {
                percentOffErrorObject = {
                    isError: false,
                    message: ''
                };
                percentOffErrors.push(percentOffErrorObject);
            }
        }

        return percentOffErrors;
    }

    publicApi.validatePercentageWarning = function (rewards) {

        var arrlength = rewards.length;
        var prctWarnObj = {};
        var percentageWarning = [];

        for (var i = 0; i < arrlength; i++) {

            if (rewards[i].value > 50 && rewards[i].value <= 99.9) {
                prctWarnObj = {
                    isError: true,
                    message: 'You have entered over 50% for this discount.'
                };
                percentageWarning.push(prctWarnObj);
            }

            else {
                prctWarnObj = {
                    isError: false,
                    message: ''
                };

                percentageWarning.push(prctWarnObj);
            }

        }

        return percentageWarning;

    }

    publicApi.areErrorsPresent = function (validationErrorsObject) {
        for (var i in validationErrorsObject) {
            if (validationErrorsObject.hasOwnProperty(i)) {
                // This is a patch to avoid warnings preventing submit. The warning logic should be moved, either to
                // the appropriate component or to some sort of warning service.
                if (i !== 'percentageWarning' && i !== 'threeMonthsWarning') {
                    // Check for array, and if array, iterate through each
                    if (Array.isArray(validationErrorsObject[i])) {
                        for (var j in validationErrorsObject[i]) {
                            if (validationErrorsObject[i][j].isError === true) {
                                return true;
                            }
                        }
                    } else {
                        if (validationErrorsObject[i].isError === true) {
                            return true;
                        }

                    }
                }
            }
        }
        return false;
    }

    publicApi.validateDiscountEndDate = function (promotion, checkForUndefined) {
        // Calls the appropriate end date validation based on whether or not the discount is MSB
        //return (promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB' && promotion.printLabel == true || promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscount' && promotion.printLabel == true)
        return (promotion.printLabel == true)
            ? publicApi.validateEndDateWithLeadTime(promotion.startDt, promotion.endDt, checkForUndefined)
            : publicApi.validateEndDateWithoutLeadTime(promotion.startDt, promotion.endDt, checkForUndefined);
    }

    publicApi.validateRewards = function (promotion, checkForUndefined) {
        var emptyValidaton;
        var rewardsErrors;

        if (promotion.reward) {
            if (promotion.reward.type === 'PERCNTOFF' || this.userType === 228) {
                return publicApi.validatePercentOff(promotion.reward.details, checkForUndefined);
            } else if (promotion.reward.type === 'AMTOFF') {
                emptyValidaton = { isError: false, message: '' };
                rewardsErrors = [];
                promotion.reward.details.forEach(function () {
                    rewardsErrors.push(emptyValidaton);
                })
                return rewardsErrors;
            } else {
                return {
                    isError: true,
                    message: 'No reward type selected by default'
                };
            }
        }
    }

    publicApi.validateSkyTypeFilter = function (source, checkForUndefined) {
        //If all sku types are excluded return a validation error
        var skuTypeError = {
            isError: false,
            message: ''
        };

        if (checkForUndefined === true && (source === undefined ||
            source.exclusions === undefined || source.exclusions.attrs === undefined)) {
            skuTypeError = {
                isError: true,
                message: 'At least 1 Sku type must be selected.'
            };
        } else if (source != undefined && source.exclusions != undefined &&
            source.exclusions.attrs != undefined) {
            if ((source.exclusions.skuTypeAttrsInitialized == false) ||
                (source.exclusions.attrs.length === 9)) {
                skuTypeError = {
                    isError: true,
                    message: 'At least 1 Sku type must be selected.'
                };
            }
        }

        return skuTypeError;

    }

    publicApi.validatePromotion = function (promotion, checkForUndefined) {
        var validationErrors = {};
        validationErrors.startDt = publicApi.validateStartDate(promotion, checkForUndefined);
        validationErrors.endDt = publicApi.validateDiscountEndDate(promotion, checkForUndefined);
        validationErrors.minimumThreshold = publicApi.validateMinimumPurchase(promotion.reward.details, checkForUndefined);
        validationErrors.rewards = publicApi.validateRewards(promotion, checkForUndefined);
        validationErrors.priorityRange = publicApi.validatePriority(promotion.priority);
        validationErrors.percentageWarning = publicApi.validatePercentageWarning(promotion.reward.details);
        validationErrors.threeMonthsWarning = publicApi.validateThreeMonthsWarning(promotion.startDt);
        validationErrors.skuTypeFilter = publicApi.validateSkyTypeFilter(promotion.purchaseConds.sources[0], checkForUndefined);
        publicApi.validateBasketThreshold(promotion);
        return validationErrors;
    }

    return publicApi;
}]);
