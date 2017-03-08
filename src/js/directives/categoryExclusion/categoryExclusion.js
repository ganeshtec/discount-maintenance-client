// Purpose is to build promotion data.
app.directive('categoryExclusion', [ 
	function (){
	return {
		restrict: 'E',
		templateUrl: 'categoryExclusion.html',
		scope: {
			data: '=',
             promoform: '=',
			 itemtype: '=',
			 viewProp: '='
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
			console.log(" the skcope data itemtype ===>",scope.data.itemtype);
			console.log("View Prop displayOMSIdExclusion --", scope.viewProp.displayOMSIdExclusion);
			
			// if(scope.data) {
			// 	if(scope.data.itemtype && scope.data.itemtype == 'SKU') {
			// 		scope.itemexclude = 'itemsku';
					
			// 	} else {
			// 		scope.itemexclude = 'itemoms';
			// 	}
			if(scope.viewProp.displayOMSIdExclusion)
			{
				if(scope.data) {
				if(scope.data.itemtype && scope.data.itemtype == 'SKU') {
					scope.itemexclude = 'itemsku';
					
				} else {
					scope.itemexclude = 'itemoms';
				}
				
        
    		}
    	}
    	else{
    		if(scope.data) {
				if(scope.data.itemtype && scope.data.itemtype == 'OMS') {
					scope.itemexclude = 'itemoms';
					
				} else {
					scope.itemexclude = 'itemsku';
				}
				
        
    		}

    	}
        
    	}
	};
}]);