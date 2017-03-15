// Purpose is to build promotion data.
app.directive('adminPromotionFormControls', ['stateService','$location','$anchorScroll', function (stateService,$location,$anchorScroll){
    return {
        restrict: 'E',
        templateUrl: 'adminPromotionFormControls.html',
        scope: {
            data: '=',
            index: '='
        },
        link: function(scope){
            $location.hash('promoTop');
            
            scope.$on('horizontalTabClicked', function () {
                scope.setActive(0);   
            });
            
            scope.pageUp = function(index) {

                for (var i = index; i < scope.data.length; i++) {
                    if (scope.data[i].shouldDisplay) {
                        scope.setActive(i);
                        return;
                    }
                }
                // What should the button do if this is the last visible form section?
            }

            scope.pageDown = function(index) {
                for (var i = index; i >= 0; i--) {
                    if (scope.data[i].shouldDisplay) {
                        scope.setActive(i);
                        return;
                    }
                }
                // What should the button do if this is the first visible form section?
            }

            scope.setActive = function(index){
                if(index >= 0 && index < scope.data.length){
                    scope.data = stateService.deactivateSection(scope.data);
                    scope.data[index].isActive = true;                    
                    $anchorScroll();
                }
            }
        }
    };
}]);