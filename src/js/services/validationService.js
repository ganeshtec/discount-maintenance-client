/* 
	Validation Service 
	Services that will handle validation of promotion attributes
*/

app.service('validationService', ['$filter', function ($filter) {
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

    publicApi.validatePromotion = function (promotion) {
        var validationErrors = {};
        validationErrors.startDt = publicApi.validateStartDate(promotion.startDt);
        validationErrors.endDt = publicApi.validateEndDate(promotion.endDt);
        return validationErrors;
    }

    return publicApi;
}]);
