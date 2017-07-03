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
        $scope.userRoleSelected = {
            id: null,
        }

        $scope.setLoginInfo = function() {
            
            if ($cookies.get('userName') != null && $cookies.get('userName') != '') {
                $scope.username = $cookies.get('userName');
            }
            
            if ($cookies.get('userPermissions') != null) {
                $scope.userPermissions = JSON.parse($cookies.get('userPermissions'));
            }

            if ($cookies.get('currentUserRole') != null) {
                $scope.userRoleSelected.id = $cookies.get('currentUserRole');
            }
        }

        $scope.$on('user-login', function(/*event, args*/) {
            $scope.setLoginInfo();
        });

        $scope.setLoginInfo();

        $scope.getUserPerm = function(){
            var userValue = $scope.userRoleSelected.id;
            $cookies.put('currentUserRole', userValue, {
                'domain': '.homedepot.com'
            });

            var currentUrl = $location.absUrl();
            var n = currentUrl.indexOf('/discount-dashboard');

            //Switch to the dashboard if not already there
            if(n < 0) {
                $location.path('/discount-dashboard');
            }
        }

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

            $cookies.put('logout', 'true', {
                'domain': '.homedepot.com'
            });
            
            $scope.username = '';
            $scope.userPermissions = '';
            $scope.userRoleSelected.id = null;
            loginService.clearLoginData();
            loginService.setErrorStatus('');

        }
    }
]);
