// Purpose is to popuplate the modal with a message.
// Has control to close the modal
app.directive('messageModal', [function () {
    return {
        restrict: 'E',
        templateUrl: 'messageModal.html',
        scope: {
            modal: '='
        },
        link: function (scope) {
            scope.close = function () {
                $('#messageModal').popup('close');
            };
        }
    };
}]);
