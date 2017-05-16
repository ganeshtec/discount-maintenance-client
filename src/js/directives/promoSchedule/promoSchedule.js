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
    $scope.$watch('data', function (nv) {
        if (nv) {
            if (nv.startDt) {
                $scope.startDt = new Date(nv.startDt.split(' ')[0].replace(/-/g, '\/'));
            }
            if (nv.endDt) {
                $scope.endDt = new Date(nv.endDt.split(' ')[0].replace(/-/g, '\/'));
            }
            $scope.starttime = '3:00 AM';
            $scope.endtime = '2:59 AM';
        }
    });

    this.setDatesOnEdit = function() {
        this.data.startDtFmt = this.data.startDt ? moment(this.data.startDt).toDate() : undefined;
        this.data.endDtFmt = this.data.endDt ? moment(this.data.endDt).toDate() : undefined;
    }

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
        if (this.validationErrors.startDt.isError === false) {
            this.data.startDt = moment(this.data.startDtFmt).format('YYYY MM DD');
        }
        if (this.validationErrors.endDt.isError === false) {
            this.data.endDt = moment(this.data.endDtFmt).format('YYYY MM DD');
        }
    }

    this.setDatesOnEdit();

}
