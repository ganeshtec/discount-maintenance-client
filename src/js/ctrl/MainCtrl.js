// Main Controller for root scope
app.controller('MainCtrl', ['$scope', '$location', '$cookies', 'DataFactory', 'SECTIONS', 'promotionDataService','loginService', 'OverlayConfigFactory',
    function($scope, $location, $cookies, DataFactory, SECTIONS, promotionDataService,loginService,OverlayConfigFactory) {
	    $scope.messageModal = DataFactory.messageModal;
	    $scope.username = '';	    
			$scope.previewData = { data :{}};
			$scope.formHolder = {};
			$scope.previewFormHolder = {};
			$scope.previewOverlayConfig = OverlayConfigFactory.getInstance();
			$scope.previewOverlayConfig.mask(true);
			if($cookies.get('userName') != null &&  $cookies.get('userName') != '') {
			   $scope.username = $cookies.get('userName');
			}
      $scope.sections = new SECTIONS();
      $scope.section = promotionDataService.getSection($scope.sections);
      $scope.sectionInx = $scope.sections.indexOf($scope.section);
			// Watch change in sections to set current section
  		$scope.$watch('sections', function(model, oldModel){
  			if(model !== oldModel){
  				$scope.sectionInx = $scope.sections.indexOf(promotionDataService.getSection(model));
  			}
  		}, true);
        
           
          //session invalidation check
    if ($cookies.get('THDSSO') != null && $cookies.get('THDSSO') != 'null') {
          loginService.setErrorStatus('');
          
          loginService.sessionValidate($cookies.get('THDSSO') , 'main');
           
          
         
      } else {
          loginService.setErrorStatus('invalidsession');
          $location.path("login");

      }
      
      $scope.logout = function () {
         
            $cookies.remove('THDSSO',{'domain': '.homedepot.com'});
            $cookies.remove('userName',{'domain': '.homedepot.com'}); 
            $cookies.remove('userPermissions',{'domain': '.homedepot.com'});           
            $cookies.put('logout', 'true',{'domain': '.homedepot.com'});

            loginService.setErrorStatus('');
            
           
         
          
      }

      // get promo subtypes
  		// var getPromotionPromise = promotionDataService.getPromotionSubTypes();
    //   getPromotionPromise.then(
    //       function(data) {
    //           DataFactory.promotionSubTypes = data.promotionSubTypes;
    //       },
    //       function(error) {
    //           DataFactory.messageModal.message = error;
    //           DataFactory.messageModal.title = 'Error';
    //           $('#messageModal').popup();

    //       });

        

}]);