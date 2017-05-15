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

        // NEED TO REFACTOR THIS TO COMPARE THE TODAY MOMENT OBJECT TO START DATE
        var today = moment();

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
            if (endDt < startDt) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be before start date.';
            } else if (endDt < today) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be earlier than today.';
            }
        }

        return endDateError;
    }

    publicApi.validateMSBEndDate = function (startDt, endDt) {
        var endDateError = {
            isError: false,
            message: ''
        };

        var leadTimePromise = leadTimeService.fetchLeadTime();
        leadTimePromise.then(function (leadTime) {
            var minEndDate = publicApi.getMinEndDate(startDt,leadTime);
            if (endDt) {
                if (endDt < minEndDate) {
                    endDateError.isError = true;
                    endDateError.message = 'Please enter a valid end date. Earliest possible MSB end date is ' + minEndDate + '.';
                }
            }
            return endDateError;
        })
        return endDateError;
    }

    publicApi.getMinEndDate = function (startDt,leadTime) {
        var today = moment();
        // setting new Date with startDt assumes UTC, so it is off depending on the time of day.
        // With this logic, before 8EST the end date is one day too soon.
        // We could make it "leadTime + 1", but minEndDate would be one day too far after 8pm EST.
        var startDate = (startDt && startDt >= today) ? moment(startDt) : today;
        var minEndDate = moment(startDate).add(leadTime, 'days');
        return minEndDate;
    };

    publicApi.validateMinimumQty = function (rewards) {
        var minQtyErrObj;
        var minQtyErrors = [];

        for (var i = 0; i < rewards.length; i++) {
            // null and undefined checks are necessary here. I tried to check
            // "if (rewards[i].min)", but when the value is 0, it evaluates to falsey.
            if (rewards[i].min != null
                && rewards[i].min != undefined
                && rewards[i].min <= 0) {
                minQtyErrObj = {
                    isError: true,
                    message: 'Minimum purchase quantity must be greater than zero.'
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

    publicApi.validatePercentOff = function (rewards) {
        var maxPrctObj;
        var maxPercentageErrors = [];

        for (var i = 0; i < rewards.length; i++) {
            // null and undefined checks are necessary here. I tried to check
            // "if (rewards[i].value)", but when the value is 0, it evaluates to falsey.
            if (rewards[i].value != null 
                && rewards[i].value != undefined 
                && (rewards[i].value > 99.9 || rewards[i].value < 0.01)) {
                
                maxPrctObj = {
                    isError: true,
                    message: 'Please enter a value between 0.01 and 99.9.'
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
        validationErrors.startDt = publicApi.validateStartDate(promotion.startDtFmt);
        // Calls the appropriate end date validation based on whether or not the discount is MSB
        validationErrors.endDt = promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB'
            ? publicApi.validateMSBEndDate(promotion.startDtFmt, promotion.endDtFmt)
            : publicApi.validateEndDate(promotion.startDtFmt, promotion.endDtFmt);
        
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty(promotion.reward.details);
        validationErrors.percentOff = publicApi.validatePercentOff(promotion.reward.details);

        return validationErrors;
    }

    return publicApi;
}]);
