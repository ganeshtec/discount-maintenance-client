/* eslint-disable no-unused-vars */
app.component('promoSchedule', {
    templateUrl: 'promoSchedule.html',
    bindings: {
        data: '=',
        promoform: '=',
        preview: '=',
        viewProp: '=',
        formHolder: '=',
        validationErrors: '=',
    },
    controller: PromoScheduleController

});

PromoScheduleController.$inject = ['$filter', '$scope','validationService', 'utilService'];
function PromoScheduleController($filter, $scope, validationService, utilService) {
    this.startTime='3:00 AM';//For display only. see utilService.js for actual time
    this.endTime='2:59 AM';

    this.$onInit = function() {
        this.data.startDt =  utilService.convertDateStringToDate(this.data.startDt);
        this.data.endDt =  utilService.convertDateStringToDate(this.data.endDt);      
        if(utilService.convertDateToDateString(this.data.endDt) === '9999-12-31') {
            this.data.endDateSelection = true;
        } else {
            this.data.endDtFormatted =  utilService.convertDateStringToDate(this.data.endDt);         
        }        
        this.setEndDateMin();
    }

    this.setEndDtFromUI = function() {
        this.data.endDt = this.data.endDtFormatted;
    }

    this.updateNoEndDate = function() {
        if(this.data.endDateSelection) {
            this.data.endDt = utilService.convertDateStringToDate('12/31/9999');
        } else {
            this.data.endDt = null;
        }
        this.data.endDtFormatted = null;
    }

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
    }

    this.isPromotionActive = function(){
        return utilService.isPromotionActive(this.data);
    }
        
    this.setEndDateMin = function () {
        this.data.minEndDt = moment(this.data.startDt).format('YYYY-MM-DD');
    }
}
