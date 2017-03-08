// Purpose is to build and render navigation, Control to set active state
app.directive('storeAdminSubnav', ['stateService', function (stateService){
	return {
		restrict: 'E',
		templateUrl: 'storeAdminSubnav.html',
		scope: {
			data: '='
		},
		link: function(scope, $element, attrs){
			scope.setActive = function(item){
				scope.data = stateService.deactivateSection(scope.data);
				item.isActive = true;
			}
		}
	};
}]);