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

        var today = moment();
        if(startDt && moment(startDt).isBefore(today, 'day')) {
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
        var today = moment();

        if (endDt) {
            if (moment(endDt).isBefore(startDt, 'day')){
                endDateError.isError = true;
                endDateError.message = 'End date cannot be before start date.';
            } else if (moment(endDt).isBefore(today, 'day')) {
                endDateError.isError = true;
                endDateError.message = 'End date cannot be earlier than today.';
            }
        }

        return endDateError;
    }

    publicApi.validatePriority = function(priority) {
        var priorityErrors = {
            isError: false,
            message: ''
        };


        if(priority && (priority < 0 || priority > 1000 || priority % 1 != 0)) {
            priorityErrors.isError = true;
            priorityErrors.message = 'Enter number between 0 and 1000';
        }

        return priorityErrors;
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
                if (moment(endDt).isBefore(minEndDate, 'day')) {
                    endDateError.isError = true;
                    endDateError.message = 'Please enter a valid end date. Earliest possible MSB end date is ' + minEndDate.format('MM/DD/YYYY') + '.';
                }
            }
            return endDateError;
        })
        return endDateError;
    }

    publicApi.getMinEndDate = function (startDt,leadTime) {
        var today = moment();
        var startDate = (startDt && today.isBefore(startDt, 'days')) ? moment(startDt) : today;
        var minEndDate = moment(startDate).add(leadTime, 'days');
        return minEndDate;
    };

    // REFACTOR TO USE MOMENTJS
    publicApi.validateThreeMonthsWarning = function (startDt) {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var todayDT = new Date(today);
        var startDT = new Date(startDt);

        var threeMonthsTime = 90 * 24 * 60 * 60 * 1000;

        var threeMonthsWarningErr = {
            isError: false,
            message: ''
        };
       
        if (startDT.getTime() - todayDT.getTime() >= threeMonthsTime) {
            threeMonthsWarningErr.isError = true;
            threeMonthsWarningErr.message = 'This discount is starting 3 or more months later'
        }

        return threeMonthsWarningErr;
    }

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

    publicApi.validatePercentageWarning = function (rewards) {

        var arrlength = rewards.length;
        var prctWarnObj = {};
        var percentageWarning = [];

        for (var i = 0; i < arrlength; i++) {

            if (rewards[i].value > 50 ) {
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


    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};
        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        // Calls the appropriate end date validation based on whether or not the discount is MSB
        validationErrors.endDt = promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB'
            ? publicApi.validateMSBEndDate(promotion.startDt, promotion.endDt)
            : publicApi.validateEndDate(promotion.startDt, promotion.endDt);
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty(promotion.reward.details);

        validationErrors.maxPercentage = publicApi.validatePercentOff(promotion.reward.details);
        validationErrors.priorityRange = publicApi.validatePriority(promotion.priority);
        validationErrors.percentageWarning = publicApi.validatePercentageWarning(promotion.reward.details);
        validationErrors.threeMonthsWarning = publicApi.validateThreeMonthsWarning(promotion.startDt);
        return validationErrors;
    }

    return publicApi;
}]);
