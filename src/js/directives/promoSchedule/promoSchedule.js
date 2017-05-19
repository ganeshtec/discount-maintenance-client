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
      console.log(this.data);
      this.data.startDtFmt = this.convertDateStringToDate(this.data.startDt);
      this.data.endDtFmt = this.convertDateStringToDate(this.data.endDt);
    }

    this.convertDateStringToDate(dateString) {
      return dateString ? moment(dateString).toDate() : undefined;
    }

    this.$onChanges = function(changes) {
      console.log(this.data);
      console.log(changes);
    }

    this.setStartDate = function() {
      this.data.startDt = moment(this.data.startDtFmt).format('YYYY-MM-DD') + ' 03:00:00';
    }

    this.setEndDate = function () {
      this.data.endDt = moment(this.data.endDtFmt).format('YYYY-MM-DD') + ' 02:59:59';
    }

    this.validatePromotion = function() {
        console.log(this.data);
        console.log(this.validationErrors);
        this.validationErrors = validationService.validatePromotion(this.data);
        console.log(this.validationErrors);
        if (this.validationErrors.startDt.isError === false && this.data.startDtFmt) {
            this.setStartDate();
        }
        if (this.validationErrors.endDt.isError === false && this.data.endDtFmt) {
            console.log("setting endDt...");
            this.setEndDate();
        }
        console.log(this.data);
    }

    //this.setDatesOnEdit();

}
