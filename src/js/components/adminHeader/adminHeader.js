app.component('adminHeader', {
    bindings: {
        data: '=',
        promotype: '<',
        uistate: '<',
        urls: '<',
    },
    templateUrl: 'adminHeader.html',
    controller: HeaderController
});

function HeaderController(utilService) {
    var ctrl = this;
    ctrl.utilService = utilService;
    ctrl.isEndDtWithinLeadTime = false;
    ctrl.$onInit = function () {
        if(ctrl.data!=null){
            ctrl.isEndDtWithinLeadTime = ctrl.utilService.isSubmitEligibleForDisable(ctrl.data);
        }
    }
}
