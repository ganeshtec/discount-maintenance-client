app.service('modalService', ['$mdDialog', function ($mdDialog) {
    var publicApi = {};

    publicApi.savedAlert = function (title, message) {
        var options = {};
        options.onRemoving = function () {
            window.location = '#/discount-dashboard';
        }
        $mdDialog.show($mdDialog.alert(options)
            .title(title)
            .escapeToClose(false)
            .clickOutsideToClose(true)
            .textContent(message)
            .ok('Go to dashboard'));
    }

    publicApi.showAlert = function (title, message) {
        $mdDialog.show($mdDialog.alert()
            .title(title)
            .textContent(message)
            .ok('Ok'));
    }

    return publicApi;
}]);