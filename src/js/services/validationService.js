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

        if (startDt < today) {
            startDateErrors.isError = true;
            startDateErrors.message = 'Sravanthi hates this.';
        }

        return startDateErrors;
    }

    publicApi.validateEndDate = function (endDt) {
        var endDateErrors = {
            isError: false,
            message: ''
        };

        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (endDt < today) {
            endDateErrors.isError = true;
            endDateErrors.message = 'Sravanthi hates this too.';
        }

        return endDateErrors;
    }



    publicApi.validateLeadTime = function (promoSubTypeCd, endDt, processErrorMessage) {
        var endDtLeadTimeError = {
            isError: false,
            message: ''
        };

        var today = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (promoSubTypeCd == 'ProductLevelPerItemPercentDiscountMSB') {
            var leadTimePromise = leadTimeService.fetchLeadTime();

            leadTimePromise.then(function (value) {
                var minEndDate = publicApi.getMinEndDate(value);
                var isValid = publicApi.isEndDateValid(minEndDate, endDt);
                if (!isValid) {
                    endDtLeadTimeError.isError = true;
                    endDtLeadTimeError.message = 'Will hates this MSB.';
                    processErrorMessage(endDtLeadTimeError);
                }
                return endDtLeadTimeError;
            }
            )
        }
    }

    publicApi.getMinEndDate = function (value) {
        var today = new Date();
        var minEndDate = $filter('date')(today.setDate(today.getDate() + value), 'yyyy-MM-dd')
        //scope.data.minEndDate = minEndDate;
        return minEndDate;
    };

    publicApi.isEndDateValid = function (minDate, endDt) {
        if (endDt < minDate) {
            return false;
        } else {
            return true;
        }
    };

    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};
        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        validationErrors.endDt = publicApi.validateEndDate(promotion.endDt);
        publicApi.validateLeadTime(promotion.promoSubTypeCd, promotion.endDt, function (errorMsg) {
            validationErrors.endDtLeadTime = errorMsg;
        });
        return validationErrors;
    }

    return publicApi;
}]);
