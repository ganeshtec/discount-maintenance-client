app.directive('fixHeight', ['$timeout', function ($timeout){
	return {
		restrict : 'A',
		scope : {
			subtract : '='
		},
		link : function(scope, $element, attrs){
			$timeout(function () { 
				var height = window.innerHeight/1.75;
				$element.css('min-height', height);
			}, 0, false);
		}
	};
}]);