// Main Controller for root scope
app.controller('MainCtrl', ['$scope', '$location', '$cookies', 'DataFactory', 'SECTIONS', 'promotionDataService', 'loginService', 'OverlayConfigFactory',
    function ($scope, $location, $cookies, DataFactory, SECTIONS, promotionDataService, loginService, OverlayConfigFactory) {
        $scope.messageModal = DataFactory.messageModal;
        $scope.username = '';
        $scope.userPermissions = '';
        $scope.previewData = {
            data: {}
        };
        $scope.formHolder = {};
        $scope.previewFormHolder = {};
        $scope.previewOverlayConfig = OverlayConfigFactory.getInstance();
        $scope.previewOverlayConfig.mask(true);

        $scope.setLoginInfo = function() {
            
            if ($cookies.get('userName') != null && $cookies.get('userName') != '') {
                $scope.username = $cookies.get('userName');
            }
            
            if ($cookies.get('userPermissions') != null) {
             $scope.userPermissions = JSON.parse($cookies.get('userPermissions'));
           // $scope.userType = userPermissions[0]['id'];
            }
        }

        $scope.$on('user-login', function(event, args) {
            $scope.setLoginInfo();
        });

        $scope.setLoginInfo();

        $scope.sections = new SECTIONS();
        $scope.section = promotionDataService.getSection($scope.sections);
        $scope.sectionInx = $scope.sections.indexOf($scope.section);
        // Watch change in sections to set current section
        $scope.$watch('sections', function (model, oldModel) {
            if (model !== oldModel) {
                $scope.sectionInx = $scope.sections.indexOf(promotionDataService.getSection(model));
            }
        }, true);
        //session invalidation check
        if ($cookies.get('THDSSO') != null && $cookies.get('THDSSO') != 'null') {
            loginService.setErrorStatus('');
            loginService.sessionValidate($cookies.get('THDSSO'), 'main');
        } else {
            loginService.setErrorStatus('invalidsession');
            $location.path('login');
        }
                
        $scope.logout = function () {
            
        /*
            $cookies.remove('THDSSO', {
                'domain': '.homedepot.com'
            });
            $cookies.remove('userName', {
                'domain': '.homedepot.com'
            });
            $cookies.remove('userPermissions', {
                'domain': '.homedepot.com'
            });
            $cookies.put('logout', 'true', {
                'domain': '.homedepot.com'
            });
            
            loginService.setErrorStatus('');

            //$scope.$broadcast('userLogout');
        */
            $scope.username = '';
            $scope.userPermissions = '';
            loginService.clearLoginData();

        }
    }
]);
