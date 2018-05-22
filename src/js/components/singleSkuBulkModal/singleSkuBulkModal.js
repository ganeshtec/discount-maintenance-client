app.component('singleSkuBulkModal', {
    bindings: {
        data: '=',
        template: '=',
        singleSkuBulkCleanUp: '&'
    },
    scope: {},
    templateUrl: 'singleSkuBulkModal.html',
    controller: singleSkuBulkModalController,
});

function singleSkuBulkModalController($mdDialog) {
    var ctrl = this;

    ctrl.closeModal = function () {
        ctrl.data.singleSkuBulk = 0;
        ctrl.template.id = 0;
        $mdDialog.hide();
    };

    ctrl.singleSkuBulkSelected = function () {
        ctrl.singleSkuBulkCleanUp();
        $mdDialog.hide();
    };
}
