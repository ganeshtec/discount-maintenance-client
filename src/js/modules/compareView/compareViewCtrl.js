app.controller('compareViewCtrl', ['$scope', '$routeParams','$timeout','$cookies','$location', 'loginService','promotionDataService', 'PromotionData', 'SECTIONS', 'DataFactory', 'createTestRecord','OverlayConfigFactory', 'URL_CONFIG',
	function ($scope, $routeParams,$timeout ,$cookies,$location,loginService,promotionDataService, PromotionData, SECTIONS, DataFactory, createTestRecord,OverlayConfigFactory,URL_CONFIG) {
		var promotionID = $routeParams.id || null;
		var promotionID1 = $routeParams.promotionID1 || null;
		var promotionID2 = $routeParams.promotionID2 || null;


		$scope.sections = [];
		$scope.previewData = { data :{}};
		$scope.previewOverlayConfig = OverlayConfigFactory.getInstance();
		$scope.previewOverlayConfig.mask(true);		
		$scope.urls = new URL_CONFIG();
		$scope.promotions = [];

		// Private Methods
		// Method to get test data - Test Should return promotion record based on type
		function getPromotionTest(type){
			return promotionDataService.getPromotionTest(type);
		}
		// Method to get promotion by id - Test Should return promotion record
		function getPromotionByID(id){
          
			var getPromotionPromise = promotionDataService.getPromotionByID(id);
      getPromotionPromise.then(
          function(data) {
              $scope.promotions.push(data);
              
          },
          function(error) {
              DataFactory.messageModal.message = error;
              DataFactory.messageModal.title = 'Error';
              $('#messageModal').popup();
          });
		}
        
      

		// Initializes Data Model
		function init(){
	    //checking the session validation.
            
			$scope.validData = {};
			$scope.messageModal = {};		
			 
			$scope.UiState = 'Compare';
			$scope.editMode = true;
			
			$scope.sections = new SECTIONS();
			$scope.section = promotionDataService.getSection($scope.sections);
			$scope.sectionInx = $scope.sections.indexOf($scope.section);

	    getPromotionByID(promotionID1);
      getPromotionByID(promotionID2);
			
		}

		// initialized promotion interface
		
		init({ promoId: promotionID });

		// Watch change in sections to set current section
		$scope.$watch('sections', function(model, oldModel){
			if(model !== oldModel){
				
				$scope.sectionInx = $scope.sections.indexOf(promotionDataService.getSection(model));
			}
		}, true);
}]);