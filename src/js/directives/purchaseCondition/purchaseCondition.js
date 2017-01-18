// Purpose is to build purchase conditions.
app.directive('purchaseCondition', ['purchaseCondition',
	function (purchaseCondition){
	return {
		restrict: 'E',
		templateUrl: 'purchaseCondition.html',
		scope: {
			data: '=',
            reward: '=',
             //qualuom: '=',
            promoform: '=',
            preview: '=',
            isDisabled: '=',
			purchaseCondition: '=',
			promotype : '='
		},
      
		link: function(scope, $element, attrs){
			// function updateQualUOM(qualuom){
			// 	if(scope.data){
			// 		for (var i = 0; i < scope.data.length; i++) {
			// 			scope.data[i].qualUOM = qualuom;
			// 		}
			// 	}
			// }
			scope.addPurchaseCondition = function(){
				scope.data = scope.data || [];
				var condition = new purchaseCondition();
				//condition.seq = scope.data.length;
                scope.data.push(condition); 
				//scope.data[scope.data.length - 1].qualUOM = scope.qualuom;
                
				console.log('purchaseCondition====>', scope.data);
			}

			scope.removePurchaseCondition = function(index){
				scope.data.splice(index, 1);
			}
			// Initialize details
			//scope.qualUOM = (scope.data && scope.data.length) ? scope.data[0].qualUOM : 'Quantity';
			
			if(scope.data && !scope.data.length){
               
				scope.addPurchaseCondition();
                
			}
            
            

			// scope.$watch('qualUOM', function(model, oldModel){
			// 	console.log('watching qualuom ', model);
			// 	if(model !== oldModel){
			// 		updateQualUOM(model);
			// 	}
			// })
		}
	};
}]);