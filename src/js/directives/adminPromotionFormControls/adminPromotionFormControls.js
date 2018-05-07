// Purpose is to build promotion data.
app.directive('adminPromotionFormControls', ['stateService', '$location', '$anchorScroll', '$rootScope',
    function (stateService, $location, $anchorScroll, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'adminPromotionFormControls.html',
            scope: {
                data: '=',
                index: '='
            },
            link: function (scope) {
                scope.data.showSummaryTab = $rootScope.showSummaryTab;
                scope.$on('horizontalTabClicked', function () {
                    scope.setActive(0);
                });

                scope.pageUp = function (index) {

                    for (var i = index; i < scope.data.length; i++) {
                        if (scope.data[i].shouldDisplay) {
                            scope.setActive(i);
                            return;
                        }
                    }
                    // What should the button do if this is the last visible form section?
                }

                scope.pageDown = function (index) {
                    for (var i = index; i >= 0; i--) {
                        if (scope.data[i].shouldDisplay) {
                            scope.setActive(i);
                            return;
                        }
                    }
                    // What should the button do if this is the first visible form section?
                }

                scope.setActive = function (index) {
                    if (index >= 0 && index < scope.data.length) {
                        scope.data = stateService.deactivateSection(scope.data);
                        scope.data[index].isActive = true;
                        $anchorScroll();
                    }
                }

                scope.showNextButton = function (index) {

                    return ((scope.data.showSummaryTab && index < scope.data.length - 1) || (!scope.data.showSummaryTab && index < scope.data.length - 2))

                }
            }
        };
    }]);
