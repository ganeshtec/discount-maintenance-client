app.controller('viewContextController', ['$scope', '$routeParams', '$router', '$ALLOWED_PERMISSION_IDS',
	function ($scope, $routeParams, $router) {

			if($scope.permissions === $ALLOWED_PERMISSION_IDS.MFA)
				$router.path('/promotion-mfa');
			else if($scope.permissions === $ALLOWED_PERMISSION_IDS.DIGITAL)
				$router.path('/promotion-digital');
	}]);