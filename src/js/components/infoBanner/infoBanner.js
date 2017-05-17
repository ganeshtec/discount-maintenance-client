app.component('infoBanner', {
    templateUrl: 'infoBanner.html',
    bindings: {
        data: '='
    },
    controller: InfoBannerController,
});

function InfoBannerController(utilService) {
    var ctrl=this;
    var leadPromise = utilService.getLeadTime();
    leadPromise.then(function (value) {
        ctrl.leadTime = value;
    })
}
