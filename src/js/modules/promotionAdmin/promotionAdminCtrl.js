app.controller('promotionAdminCtrl', ['$scope', '$routeParams','$timeout','$cookies','$location', 'loginService','promotionDataService', 'PromotionData', 'SECTIONS', 'DataFactory', 'createTestRecord','URL_CONFIG',
	function ($scope, $routeParams,$timeout ,$cookies,$location,loginService,promotionDataService, PromotionData, SECTIONS, DataFactory, createTestRecord,URL_CONFIG) {
		var promotionID = $routeParams.id || null;
		var cloneId = $routeParams.cloneid || null;
		var promotionID1 = $routeParams.promotionID1 || null;
		var promotionID2 = $routeParams.promotionID2 || null;
		$scope.sections = [];

		$scope.comparemode = (promotionID2) ? true : false;		
		$scope.clonemode = (cloneId) ? true : false;
		$scope.urls = new URL_CONFIG();
		
		if($cookies.get('userName') != null &&  $cookies.get('userName') != '') {
			$scope.username = $cookies.get('userName');
			}

		// Private Methods
		// Method to get test data - Test Should return promotion record based on type
		function getPromotionTest(type){
			return promotionDataService.getPromotionTest(type);
		}
		// getPromotionTest(false);
		// Method to get promotion by id - Test Should return promotion record
		function getPromotionByID(id){
          
			var getPromotionPromise = promotionDataService.getPromotionByID(id);
      getPromotionPromise.then(
          function(data) {
          		var promoData = new PromotionData();
              $scope.promotionData = angular.extend(promoData, data);
              if ($scope.clonemode) {
                  $scope.promotionData.origRequestId = data.promoId;
                  $scope.promotionData.promoId = 0;
                  //clear coupon id 
                   delete $scope.promotionData.couponId;
                   //change the status to draft
                   $scope.promotionData.status = 20;
              }
              $scope.promotionData.meta.lastUpdatedBy = $scope.username;
              console.log(" the promo data is ===>" + JSON.stringify(data));
          },
          function(error) {
              DataFactory.messageModal.message = error;
              DataFactory.messageModal.title = 'Error';
              $('#messageModal').popup();
          });
		}
    
	    function setPromoData(){
	    	$scope.promotionData = new PromotionData();
				$scope.promotionData.meta.created = $scope.username;
				$scope.promotionData.meta.lastUpdatedBy = $scope.username;
	    }

	    function setViewProperties(userType) {
	    	if (userType == "store") {
				$scope.viewProperties = getStoreViewProperties();
			} else if (userType == "online") {
				$scope.viewProperties = getOnlineViewProperties();
			} 
			console.log("scope.viewProperties", $scope.viewProperties);
	    }

	    function getStoreViewProperties() {
			console.log("GET STORE VIEW PROPERTIES");
			return {
                displayPromoDescription: false,
                displayRedemptionMethod: false,
                displayCombinationPromo: false,
                displayPriority: false,
                dispalyOMSId: false,
                displayMFGBrand: false,
                displayWebHierarchy: false,
                displayOMSIdExclusion: false,
                displayExclusionSubCategories: false,
                displayPaymentType: false,
                displayScheduleTime: false
            }
		}

		function getOnlineViewProperties() {
			console.log("GET ONLINE VIEW PROPERTIES");
			return {
                displayPromoDescription: true,
                displayRedemptionMethod: true,
                displayCombinationPromo: true,
                displayPriority: true,
                displayOMSId: true,
                displayMFGBrand: true,
                displayWebHierarchy: true,
                displayOMSIdExclusion: true,
                displayExclusionSubCategories: true,
                displayPaymentType: true,
                displayScheduleTime: true
            }
		}


		// Initializes Data Model
		function init(data){
	    //checking the session validation.
	       //isValidSession();
            
			$scope.validData = {};
			$scope.messageModal = {};		
			 
			$scope.UiState = ($scope.comparemode) ? 'Compare' : ((data.promoId) ? 'Edit' : 'Create New');
			$scope.editMode = ($scope.UiState === 'Edit');
			
			// $scope.userType = $scope.authService.getUserType();
			$scope.userType = "online";

			setViewProperties($scope.userType);
			
			$scope.sections = new SECTIONS($scope.userType);
			$scope.section = promotionDataService.getSection($scope.sections);
			$scope.sectionInx = $scope.sections.indexOf($scope.section);
			console.log("$scope.sectionInx", $scope.sectionInx);


			//get new data
			if (!$scope.editMode) {

                if ($scope.clonemode) {
                    getPromotionByID(data.promoId);
                }else if ($scope.comparemode) {
                        console.log("promoID1 & promoID2 values ===>"+JSON.stringify(data));
					    getPromotionByID(data.promotionID1);	
                        getPromotionByID(data.promotionID2);				
							
					}else {
							setPromoData();
					}
			}
						// get promotion record
			else {
					// $scope.promotionData = getPromotionTest(1);
					getPromotionByID(data.promoId);
					// For Testing Create Only!!!
					//$scope.promotionData = new createTestRecord();
					// End Testing Create
			}
		}

		// initialized promotion interface
		if($scope.clonemode) {
				promotionID = cloneId;
		}
		init({ promoId: promotionID });

		// Watch change in sections to set current section
		$scope.$watch('sections', function(model, oldModel){
			if(model !== oldModel){
				console.log('sections');
				console.log("$scope.sectionInx before change", $scope.sectionInx);
				console.log("model", model);
				console.log("promotionDataService.getSection(model)", promotionDataService.getSection(model));
				$scope.sectionInx = $scope.sections.indexOf(promotionDataService.getSection(model))
				console.log("$scope.sectionInx after change", $scope.sectionInx);
			}
		}, true);

		$scope.isEditable = function(promotion){
			var editable = {
				"61" : true ,// active
				"57" : true, // pending				
			}
			return editable[promotion.status]
		}
}]);