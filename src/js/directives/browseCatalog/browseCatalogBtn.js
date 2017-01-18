app.directive('browseCatalogBtn',[
				function() {
					return {
						restrict : 'E',
						templateUrl : 'browseCatalogBtn.html',
						link : function(scope, elem, attrs) {
							
							scope.browseCatalog = function(event){
								scope.$emit('btnBrowseOnClick');
								console.log('browseCatalog');	
								
							}					
							
						}
					};
				}]);