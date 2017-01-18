// Purpose is to build promotion data.
app.directive('adminPromotionFormControls', ['stateService','$location','$anchorScroll', function (stateService,$location,$anchorScroll){
	return {
		restrict: 'E',
		templateUrl: 'adminPromotionFormControls.html',
		scope: {
			data: '=',
			index: '='
		},
		link: function(scope, $element, attrs){
			$location.hash("promoTop");
			
			scope.$on('horizontalTabClicked', function () {
				scope.setActive(0);   
    		});
			
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