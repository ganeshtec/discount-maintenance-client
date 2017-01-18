// Purpose is to build promotion data.
app.directive('categoryExclusion', [ 
	function (){
	return {
		restrict: 'E',
		templateUrl: 'categoryExclusion.html',
		scope: {
			data: '=',
             promoform: '=',
			 itemtype: '='
			
		},
		link: function(scope, $element, attrs){
			scope.search = function () {
				if(scope.itemexclude === 'itemsku') {
					scope.itemtype = 'SKU';
				} else {
					scope.itemtype = 'OMS';
				}

			}

			console.log(" the skcope data ===>",scope.data);
			
			if(scope.data) {
				if(scope.data.itemtype && scope.data.itemtype == 'SKU') {
					scope.itemexclude = 'itemsku';
					
				} else {
					scope.itemexclude = 'itemoms';
				}
				
        
    		}
        
    	}
	};
}]);