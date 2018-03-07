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
    
    publicApi.showDialog = function (title, errorMessages) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            templateUrl: 'errorMessageModalTemplate.html',
            locals: {
                title: title,
                errorMessages: errorMessages
            },
            controller: DialogController
        });
        function DialogController($scope, $mdDialog, title, errorMessages) {
            $scope.errorMessages = errorMessages;
            $scope.title = title;
            $scope.closeDialog = function() {
                $mdDialog.hide();
            }
        }
    };
    return publicApi;
}]);