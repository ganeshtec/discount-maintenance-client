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

    this.validatePromotion = function() {
        this.validationErrors = validationService.validatePromotion(this.data);
    }
    
    this.convertToString = function() {
        if (this.data) {
            this.data.startDt = $filter('date')(this.data.startDtFmt, 'yyyy-MM-dd');
            this.data.endDt = $filter('date')(this.data.endDtFmt, 'yyyy-MM-dd');          
        }
    }


}
