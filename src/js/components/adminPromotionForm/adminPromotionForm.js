// Purpose is to build promotion data
app.component('adminPromotionForm', {
    templateUrl: 'adminPromotionForm.html',
    bindings: {
        data: '=',
        index: '=',
        preview: '@',
        isDisabled: '=',
        formHolder: '=',
        promoForm: '=?',
        display: '=',
        viewProp: '=',
        promoMfa: '=',
        validationErrors: '='
    },
    controller: adminPromotionFormController
});

function adminPromotionFormController(loginService, sectionsIndex) {
    var ctrl = this;
    ctrl.$onInit = function () {
        if (ctrl.userType === 228) {
            ctrl.data.reward.method = ctrl.data.reward.method || 'INDVDLAFFECTEDITMS';
        }
        ctrl.sectionsIndex = sectionsIndex;
        ctrl.userType = loginService.getCurrentUserRole();
        ctrl.formHolder.form = ctrl.promoForm ? ctrl.promoForm : ctrl.formHolder.form;

    }
}
