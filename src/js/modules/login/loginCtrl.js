app.controller('loginCtrl', ['$scope', '$rootScope', '$routeParams', '$location','$cookies', 'loginService',
    function($scope, $rootScope, $routeParams, $location, $cookies,loginService) {
        

        $scope.showError = loginService.getErrorStatus() || null;
        $scope.submit = function() {
            $cookies.remove('logout', { 'domain': '.homedepot.com' });
            $cookies.remove('userPermissions',{'domain': '.homedepot.com'});
            loginService.authenticate($scope.name, $scope.password).then(function(data) {
                $scope.showError = data;
                
                // if(!data){
                //     loginService.authorizeUser($scope.name, 'login').then(function(data) {
                //         $rootScope.$broadcast('user-login');
                //     });
                // }
                
            });

        }


        if ($cookies.get('logout') != 'true') {
            //session invalidation check
            if ($cookies.get('THDSSO') != null && $cookies.get('THDSSO') != 'null') {

                loginService.setErrorStatus('');
                loginService.sessionValidate($cookies.get('THDSSO'), 'login');



            } else {

                loginService.setErrorStatus('invalidsession');
                $location.path('login');

            }


        } 
        




    }]);