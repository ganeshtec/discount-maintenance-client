app.directive('promofilter', function(){
	return {
		restrict : 'E',
		templateUrl : 'promofilter.html',
		scope:{
			statuslist :"=", 
			typelist :"=",
			onfilter :"&" ,
		},
		controller : function(){
			console.log('controller');
		},
		link : function (scope, element, attrs) {
			scope.pages = [];
			scope.apply = function(){
				scope.onFilter()(scope.status,scope.type);
			}
		}
	}
});