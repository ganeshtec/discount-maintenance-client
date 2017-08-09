/* eslint-disable no-unused-vars */
app.component('promoSchedule', {
    templateUrl: 'promoSchedule.html',
    bindings: {
        data: '=',
        promoform: '=',
        preview: '=',
        viewProp: '=',
        formHolder: '=',
        validationErrors: '='
    },
    controller: PromoScheduleController

});

PromoScheduleController.$inject = ['$filter', '$scope','validationService', 'utilService'];
 
function PromoScheduleController($filter, $scope, validationService, utilService) {
    this.startTime='3:00 AM';//For display only. see utilService.js for actual time
    this.endTime='2:59 AM';

    this.$onInit = function() {
        this.data.startDt =  this.convertDateStringToDate(this.data.startDt);
        this.data.endDt =  this.convertDateStringToDate(this.data.endDt);

        this.data.endDt =  this.convertDateStringToDate(moment(this.data.endDt).format('YYYY-MM-DD'));
        this.setEndDateMin();

    }

    this.convertDateStringToDate = function(dateString){
        return dateString ? moment(dateString).toDate() : undefined;
    }

    this.convertDateToDateString = function(date) {
        return date ? moment(date).format('YYYY-MM-DD') : undefined;
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
