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
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        // setting new Date with startDt assumes UTC, so it is off depending on the time of day.
        // With this logic, before 8EST the end date is one day too soon.
        // We could make it "leadTime + 1", but minEndDate would be one day too far after 8pm EST.
        var startDate = (startDt && startDt >= today) ? new Date(startDt) : new Date();
        var minEndDate = $filter('date')(startDate.setDate(startDate.getDate() + leadTime), 'yyyy-MM-dd')
        return minEndDate;
    };

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
        validationErrors.endDt = promotion.promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB'
            ? publicApi.validateMSBEndDate(promotion.startDt, promotion.endDt)
            : publicApi.validateEndDate(promotion.startDt, promotion.endDt);
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty(promotion.reward.details);
        validationErrors.maxPercentage = publicApi.validateMaxPercentage(promotion.reward.details);

        return validationErrors;
    }

    return publicApi;
}]);
