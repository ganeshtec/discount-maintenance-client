app.directive('toolTipper', [
	function (){
	return {
		restrict : 'E',
		scope : {
			tooltiptitle: '@'
		},
		transclude: true,
		templateUrl: 'toolTipper.html'
	};
}]);