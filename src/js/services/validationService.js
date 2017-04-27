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

        if (endDt < today) {
            endDateErrors.isError = true;
            endDateErrors.message = 'End date cannot be earlier than today';
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
                    endDtLeadTimeError.message = 'Please enter a valid end date.Earliest possible MSB end date is ' + minEndDate;
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


    publicApi.validateEndDtWithStartDt = function(startDt, endDt) {
        
        var endDtLessThanStartErr = {
            isError: false,
            message: ''
        };

        if(endDt < startDt)
        {
            endDtLessThanStartErr.isError = true;
            endDtLessThanStartErr.message = 'End date must be after Start date.'
        }

        return endDtLessThanStartErr;
    }

    publicApi.validateMinimumQty = function (rewards) {
        //console.log(rewards.length);
        // console.log(promotion.reward);
        var arrlength = rewards.length;
        

        var minQtyError = [];

        for(var i=0; i< arrlength; i++)
        {
         
            if (rewards[i].min == 0) {
                minQtyErrObj = {
                isError: true,
                message: 'Zero is not valid'
                };
                minQtyError.push(minQtyErrObj);
            }

            else

            {
                minQtyErrObj = {
                isError: false,
                message: ''
                };
                minQtyError.push(minQtyErrObj);
            }           
                     
        } 

        return minQtyError;
 
    }

    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};
        console.log("PROMOTION", promotion);
        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        validationErrors.endDt = publicApi.validateEndDate(promotion.endDt);
        publicApi.validateLeadTime(promotion.promoSubTypeCd, promotion.endDt, function (errorMsg) {
            validationErrors.endDtLeadTime = errorMsg;
        });
        validationErrors.endDtLessStartDt = publicApi.validateEndDtWithStartDt(promotion.startDt, promotion.endDt);
        validationErrors.minQtyThreshold = publicApi.validateMinimumQty (promotion.reward.details);
       


        return validationErrors;
    }

    return publicApi;
}]);
