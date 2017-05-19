app.component('infoBanner', {
    templateUrl: 'infoBanner.html',
    controller: InfoBannerController,
});

function InfoBannerController(utilService) {
    var ctrl=this;
    var leadPromise = utilService.getLeadTime();
    leadPromise.then(function (value) {
        ctrl.leadTime = value;
    })
}
