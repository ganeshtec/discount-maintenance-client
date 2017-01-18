app.directive('tableSort', [function(){
	return {
		restrict : 'A',
		scope : {
			columnProp : '='
		},			
		link : function (scope, element, attrs) {
			scope.reverse = true;
			// Ordering data table
			element.bind('click', function(columnProp) {
				scope.reverse = (scope.columnProp === columnProp) ? !scope.reverse : false;
				scope.columnProp = columnProp;
			});
		}
	}
}]);