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

PromoScheduleController.$inject = ['$filter', '$rootScope','$scope','validationService', 'utilService'];
function PromoScheduleController($filter, $rootScope, $scope, validationService, utilService) {
    var ctrl = this;
    this.$onInit = function() {
        this.startTime='3:00 AM';//For display only. see utilService.js for actual time
        this.endTime='2:59 AM';
        this.data.startDt =  utilService.convertDateStringToDate(this.data.startDt);
        this.data.endDt =  utilService.convertDateStringToDate(this.data.endDt);
        if(this.data.promoId){
            this.startDateLimit = moment(this.data.startDt < moment() ? this.data.startDt : moment()).format('YYYY-MM-DD');
        } else {
            this.startDateLimit = moment().format('YYYY-MM-DD');
        }
        if(utilService.convertDateToDateString(this.data.endDt) === '9999-12-31') {
            this.data.endDateSelection = true;
        } else {
            this.data.endDtFormatted =  utilService.convertDateStringToDate(this.data.endDt);         
        }        
        this.setEndDateMin();
    }

    this.setEndDtFromUI = function() {
        this.data.endDt = this.data.endDtFormatted;
        ctrl.setEndDateMin();
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

    $scope.$watch('$ctrl.data.printLabel', function (model, oldModel) {
        if (model !== oldModel) {
            ctrl.setEndDateMin();
        }
    }, true);

    this.setEndDateMin = function () {
        if(this.data.printLabel){
            var minEndDt = moment(this.data.startDt ? this.data.startDt : moment()).add($rootScope.leadTime, 'days');
            this.data.minEndDt = minEndDt.format('YYYY-MM-DD');
        } else{
            this.data.minEndDt = moment(this.data.startDt).format('YYYY-MM-DD');
        }
    }
}
