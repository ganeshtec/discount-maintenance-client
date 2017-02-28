app.controller('viewContextController', ['$scope','$location',/*'$ALLOWED_PERMISSION_IDS',*/'loginService',
	function ($scope,$location,loginService) {
			var permissionsIDs=loginService.getUserPermissions();
			//if(permissionsIDs.id === $ALLOWED_PERMISSION_IDS.MFA)
			if(permissionsIDs.id == '132'){
				$location.path('promotion-mfa');
			}			//else if($scope.permissions === $ALLOWED_PERMISSION_IDS.DIGITAL)
			else if($scope.permissions == '133'){
				$location.path('promotion-digital');
			}
	}]);