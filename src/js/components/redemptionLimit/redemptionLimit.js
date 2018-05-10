app.component('redemptionLimit', {
    templateUrl: 'redemptionLimit.html',
    bindings: {
        data: '=',
        promoform: '=',
        preview: '=',
    },
    controller: RedemptionLimit

});


function RedemptionLimit($scope) {
    
    var ctrl = this;
    
    ctrl.promomax = 'promounlimt';
    ctrl.ordermax = 'orderunlimt';
    ctrl.custmax = 'custunlimt';

    $scope.$watch('$ctrl.data', function(redemptons) {
        if (redemptons) {
            if (redemptons.maxUsesPerCust != '-1') {
                ctrl.custmax = 'setcust';
            }
            if (redemptons.maxUsesOfPromo != '-1') {
                ctrl.promomax = 'promoset';
            }
            if (redemptons.maxUsesPerOrd != '-1') {
                ctrl.ordermax = 'setorder';
            }

        }
    });



    ctrl.promocheck = function() {
        if (ctrl.promomax === 'promounlimt') {
            ctrl.data.maxUsesOfPromo = '-1';
        }
    }
    ctrl.orderCheck = function() {
        if (ctrl.ordermax === 'orderunlimt') {
            ctrl.data.maxUsesPerOrd = '-1';
        }
    }

    ctrl.custCheck = function() {

        if (ctrl.custmax === 'custunlimt') {
            ctrl.data.maxUsesPerCust = '-1';
        }
    }
}
