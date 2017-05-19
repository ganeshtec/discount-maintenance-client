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
            startDateErrors.message = 'Start date cannot be earlier than today';
        }

        return startDateErrors;
    }

    publicApi.validateEndDate = function (endDt) {
        var endDateErrors = {
            isError: false,
            message: ''
        };

        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (endDt < today && endDt) {
            endDateErrors.isError = true;
            endDateErrors.message = 'End date cannot be earlier than today';
        }

        return endDateErrors;
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

    publicApi.validateLeadTime = function (promoSubTypeCd, startDate, endDt,  processErrorMessage) {
        var endDtLeadTimeError = {
            isError: false,
            message: ''
        };

        //var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
            var leadTimePromise = leadTimeService.fetchLeadTime();
            leadTimePromise.then(function (leadTime) {
                //var minEndDate = publicApi.getMinEndDate(leadTime);
                var minEndDate = publicApi.getMinEndDate(startDate,leadTime);
                var isValid = publicApi.isEndDateValid(minEndDate, endDt);
                if (!isValid && endDt) {
                    endDtLeadTimeError.isError = true;
                    endDtLeadTimeError.message = 'Please enter a valid end date.Earliest possible MSB end date is ' + minEndDate;
                    processErrorMessage(endDtLeadTimeError);
                }
                return endDtLeadTimeError;
            }
            )
        }
    }

    publicApi.getMinEndDate = function (startDt,leadTime) {
        var startdate = new Date(startDt);
        var minEndDate = $filter('date')(startdate.setDate(startdate.getDate() + leadTime), 'yyyy-MM-dd')
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

    publicApi.validateThreeMonthsWarning = function (startDt) {

        //var today = new Date();
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var todayDT = new Date(today);
        var startDT = new Date(startDt);

        // console.log("Today Date:: "+ todayDT.getTime());
        // console.log("Start Date:: "+ startDT.getTime());

        var threeMonthsTime = 90 * 24 * 60 * 60 * 1000;
        // console.log("threeMonthsTime :: "+ threeMonthsTime);

        var threeMonthsWarningErr = {
            isError: false,
            message: ''
        };
       
        if (startDT.getTime() - todayDT.getTime() >= threeMonthsTime) {
         //   console.log("Inside IF"); 
            threeMonthsWarningErr.isError = true;
            threeMonthsWarningErr.message = 'This discount is starting 3 or more months later'
        }

        return threeMonthsWarningErr;
    }

    publicApi.validateMinimumQty = function (rewards) {

        var arrlength = rewards.length;
        var minQtyErrObj ={};
        var minQtyError = [];

        for (var i = 0; i < arrlength; i++) {

            if (rewards[i].min == 0) {
                minQtyErrObj = {
                    isError: true,
                    message: 'Zero is not valid'
                };
                minQtyError.push(minQtyErrObj);
            }

            else {
                minQtyErrObj = {
                    isError: false,
                    message: ''
                };
                minQtyError.push(minQtyErrObj);
            }

        }

        return minQtyError;

    }

    publicApi.validateMaxPercentage = function (rewards) {

        var arrlength = rewards.length;
        var maxPrctObj = {};
        var maxPercentage = [];

        for (var i = 0; i < arrlength; i++) {

            if ((rewards[i].value > 100 || rewards[i].value == 0)) {
                maxPrctObj = {
                    isError: true,
                    message: 'Please enter a value between 0.01 and 100'
                };
                maxPercentage.push(maxPrctObj);
            }

            else {
                maxPrctObj = {
                    isError: false,
                    message: ''
                };
                maxPercentage.push(maxPrctObj);
            }

        }

        return maxPercentage;

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

    publicApi.validateAmountWarning = function (rewards) {

        var arrlength = rewards.length;
        var amtWarnObj = {};
        var amountWarning = [];

        for (var i = 0; i < arrlength; i++) {
            
            if (rewards[i].maxAllowedVal > 100 ) {
                amtWarnObj = {
                    isError: true,
                    message: 'You have entered over $100 for this discount.' 
                };
                amountWarning.push(amtWarnObj);
            }

            else {
                amtWarnObj = {
                    isError: false,
                    message: ''
                };
                amountWarning.push(amtWarnObj);
            }

        }

        return amountWarning;

    }

    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};

        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        validationErrors.endDt = publicApi.validateEndDate(promotion.endDt);
        publicApi.validateLeadTime(promotion.promoSubTypeCd, promotion.startDt, promotion.endDt, function (errorMsg) {
            validationErrors.endDtLeadTime = errorMsg;
        });
        validationErrors.endDtLessStartDt = publicApi.validateEndDtWithStartDt(promotion.startDt, promotion.endDt);
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty(promotion.reward.details);
        validationErrors.maxPercentage = publicApi.validateMaxPercentage(promotion.reward.details);
        validationErrors.priorityRange = publicApi.validatePriority(promotion.priority);
        validationErrors.percentageWarning = publicApi.validatePercentageWarning(promotion.reward.details);
        validationErrors.amountWarning = publicApi.validateAmountWarning(promotion.reward.details);
        validationErrors.threeMonthsWarning = publicApi.validateThreeMonthsWarning(promotion.startDt);

        return validationErrors;
    }

    return publicApi;
}]);
