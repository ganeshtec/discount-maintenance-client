app.controller('promotionAdminCtrl', ['$scope', '$routeParams','$timeout','$cookies','$location', 'loginService','promotionDataService', 'PromotionData', 'SECTIONS', 'DataFactory', 'createTestRecord','URL_CONFIG','ALLOWED_PERMISSION_IDS',
	function ($scope, $routeParams,$timeout ,$cookies,$location,loginService,promotionDataService, PromotionData, SECTIONS, DataFactory, createTestRecord,URL_CONFIG,ALLOWED_PERMISSION_IDS) {
		var promotionID = $routeParams.id || null;
		var cloneId = $routeParams.cloneid || null;
		var promotionID1 = $routeParams.promotionID1 || null;
		var promotionID2 = $routeParams.promotionID2 || null;
		var allowedPermissionIDs=ALLOWED_PERMISSION_IDS();
		$scope.sections = [];

		$scope.comparemode = (promotionID2) ? true : false;		
		$scope.clonemode = (cloneId) ? true : false;
		$scope.urls = new URL_CONFIG();
		
		if($cookies.get('userName') != null &&  $cookies.get('userName') != '') {
			$scope.username = $cookies.get('userName');
		}

		if($cookies.get('userPermissions') != null) {
			//$scope.userPermissions = JSON.parse($cookies.get('userPermissions'));
			var userPermissions = JSON.parse($cookies.get('userPermissions'));
			console.log("User userPermissions :: ", JSON.stringify(userPermissions));  //userPermissions["id"]);
			console.log("User userPermissions :: ", userPermissions[0]["id"]);
			$scope.userType = userPermissions[0]["id"];

			// console.log("First user permission", $scope.userPermissions[0]);
			// console.log("User permission type", typeof($scope.userPermissions));
			//console.log("User Id== " + $scope.userPermissions.id[0]);
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
	    	console.log("User Type :: " + userType);
	    	if (userType == allowedPermissionIDs.STORE) {
				$scope.viewProperties = getViewProperties(false);
			} else if (userType == allowedPermissionIDs.ONLINE) {
				$scope.viewProperties = getViewProperties(true);
			} 
			console.log("scope.viewProperties", $scope.viewProperties);
	    }

	    function getViewProperties(visiblity) {
			console.log("GET STORE VIEW PROPERTIES");
			return {
                displayPromoDescription: visiblity,
                displayRedemptionMethod: visiblity,
                displayCombinationPromo: visiblity,
                displayPriority: visiblity,
                displayOMSId: visiblity,
                displayMFGBrand: visiblity,
                displayWebHierarchy: visiblity,
                displayOMSIdExclusion: visiblity,
                displayExclusionSubCategories: visiblity,
                displayPaymentType: visiblity,
                displayScheduleTime: visiblity
            }
		}


		
			// var userPermissions = loginService.getUserPermissions();
			// console.log("User userPermissions :: ", userPermissions);
		



		// Initializes Data Model
		function init(data){
	    //checking the session validation.
	       //isValidSession();
            
			$scope.validData = {};
			$scope.messageModal = {};		
			 
			$scope.UiState = ($scope.comparemode) ? 'Compare' : ((data.promoId) ? 'Edit' : 'Create New');
			$scope.editMode = ($scope.UiState === 'Edit');
			
			// $scope.userType = $scope.authService.getUserType();
			// var userPermissions = $cookies.get('UserPermissions'); 
			// UserPermissions;//loginService.getUserPermissions();

			// if (loginService.getUserPermissions() != null) {
			// 	$scope.userPermissions = loginService.getUserPermissions();
			// }


			
			//$scope.userType = "online";

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