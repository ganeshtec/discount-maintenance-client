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

PromoScheduleController.$inject = ['$filter', '$scope','validationService'];
 
function PromoScheduleController($filter, $scope, validationService) {
console.log("Validation Errors in PromoSchedule::",$scope.validationErrors);
    // $scope.$watch('data', function (nv) {
    //     if (nv) {
    //         if (nv.startDt) {
    //             $scope.startDt = new Date(nv.startDt.split(' ')[0].replace(/-/g, '\/'));
    //         }
    //         if (nv.endDt) {
    //             $scope.endDt = new Date(nv.endDt.split(' ')[0].replace(/-/g, '\/'));
    //         }
    //         $scope.starttime = '3:00 AM';
    //         $scope.endtime = '2:59 AM';
    //     }
    // });

    this.$onInit = function() {
        this.data.startDt =  this.convertDateStringToDate(this.data.startDt);
        this.data.endDt =  this.convertDateStringToDate(this.data.endDt);
    }

    this.convertDateStringToDate = function(dateString){
        return dateString ? moment(dateString).toDate() : undefined;
    }

    this.convertDateToDateString = function(date) {
        return date ? moment(date).format('YYYY-MM-DD') : undefined;
    }

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
        console.log("Validation Errors in PromoSchedule in method::",this.validationErrors);
    }

}
