// Purpose is to build promotion data.
app.directive('categoryView', ['categoryDataService', 'DataFactory','OverlayConfigFactory',
	function (categoryDataService, DataFactory,OverlayConfigFactory){
	return {
		restrict: 'E',
		templateUrl: 'categoryView.html',
		scope: {
			data: '=',
      promoform: '=',
      isDisabled: '='
			
		},
		link: function(scope, $element, attrs){
			scope.categoryDataLoading = false;
			scope.data = $.extend(true, [], scope.data);
			scope.searchResults = [];
            scope.showInvalidError = false;
			
			scope.browseCatalogOverlayConfig = OverlayConfigFactory.getInstance();
			scope.browseCatalogOverlayConfig.mask(true);
			
			scope.addItem = function(item){
				var data = {};
				data.name = item.name;
				data.id = item.source;
				data.catalog = 'Web';
				
				index = -1;
                if (!scope.data) {
                    scope.data = [];
                }
				for(var i = 0, len = (scope.data).length; i < len; i++) {
				    if ((scope.data)[i].id === data.id) {
				        index = i;
				        break;
				    }
				}
				
				 if(index === -1){
					scope.data.push(data);
					scope.itemSearch = "";
				 }
				 else{
				 	DataFactory.messageModal.message = 'Category is already added: ' + data.name;
				 	DataFactory.messageModal.title = 'Warning';
				 	$('#messageModal').popup();
				 }
				
				console.log('Add item', scope.data);
			}
			
		scope.$on('addedCategory', function (event,item) {
			scope.data.push(item);  
		});
		
		scope.$on('deletedCategory', function (event,item) {
			var index;
			
			for(var i = 0, len = scope.data.length; i < len; i++) {
			    if (scope.data[i].source === item.source) {
			        index = i;
			        break;
			    }
			}
			
			scope.data.splice(index,1);
			
		});
		
			scope.removePromoCode = function(index){
				scope.data.splice(index, 1);
			}

			scope.search = function(data){
				var getCategoriesPromise = categoryDataService.getCategoriesSearch(data);
				scope.categoryDataLoading = true;
				
				getCategoriesPromise.then(
							function(data){
								
								scope.categoryDataLoading = false;
								
								scope.searchResults = data.data;
								
								//TODO: check why this is here , there is a typo
							
								if(data.data.length == 0) {
									DataFactory.messageModal.message = 'Category not found';
									DataFactory.messageModal.title = 'Warning';
									$('#messageModal').popup();
								}
							},
							function(error){
								scope.categoryDataLoading = false;
								DataFactory.messageModal.message = error;
								DataFactory.messageModal.title = 'Error';
								$('#messageModal').popup();
							});
							//scope.categoryDataLoading = false;
			}
		}
	};
}]);