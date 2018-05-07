// Main Controller for root scope


app.controller('MainCtrl', ['$q', '$rootScope', '$scope', '$location', 'DataFactory', 'SECTIONS', 'promotionDataService', 'loginService', 'leadTimeService', 'OverlayConfigFactory', 'featureFlagService', 'constantsConfigService',
    function ($q, $rootScope, $scope, $location, DataFactory, SECTIONS, promotionDataService, loginService, leadTimeService, OverlayConfigFactory, featureFlagService, constantsConfigService) {
        $scope.messageModal = DataFactory.messageModal;
        $scope.username = '';
        $scope.userPermissions = '';
        $scope.previewData = {
            data: {},
        };
        $scope.channelState = {};
        $scope.formHolder = {};
        $scope.previewFormHolder = {};
        $scope.previewOverlayConfig = OverlayConfigFactory.getInstance();
        $scope.previewOverlayConfig.mask(true);
        $scope.userRoleSelected = {
            id: null,
        };
        $rootScope.discountEngineErrors = [];

        $scope.setLoginInfo = function () {
            $scope.username = loginService.getUserName();
            $scope.userPermissions = loginService.getUserPermissions();
            $scope.userRoleSelected.id = loginService.getCurrentUserRole().toString();

            if ($scope.userPermissions && $scope.userRoleSelected.id) {
                $scope.callGlobalServices();
            }
        }

        $scope.callGlobalServices = function () {
            var constantsTogglePromise = constantsConfigService.getConstantsFromConfig();
            var featureTogglePromise = featureFlagService.getFeatureFlags();
            var leadTimeServicePromise = leadTimeService.fetchLeadTime();

            constantsTogglePromise.then(function (data) {
                $rootScope.programIdForProMonthly = data.programIdForProMonthly;
            });

            featureTogglePromise.then(function (data) {
                $rootScope.showBasketThreshold = data.basketThreshold;
                $rootScope.showRapidPass = data.showRapidPass;
                $rootScope.showAllProDiscount = data.showAllProDiscount;
                $rootScope.segmentsFromV2Endpoint = data.segmentsFromV2Endpoint;
                $rootScope.channelToggle = data.channelSelect;
                $rootScope.displayCustomerSegmentInDCM = data.displayCustomerSegmentInDCM;
                $rootScope.singleSkuBulk = data.singleSkuBulk;
                $rootScope.receiptText = data.receiptText;
                $rootScope.costPlusPercent = data.costPlusPercent;
            });

            leadTimeServicePromise.then(function (data) {
                $rootScope.leadTime = data;
            });

        };

        $scope.$on('user-login', function () {
            $scope.setLoginInfo();
        });

        $scope.getUserPerm = function () {
            if ($scope.userRoleSelected.id) {
                loginService.setCurrentUserRole($scope.userRoleSelected.id);
            }
            $rootScope.searchParams = null;
            $scope.searchTerm = null;
            $scope.searchType = null;
            $location.path('/discount-dashboard/#');
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

        $scope.logout = function () {
            loginService.logout();
        };
    }
]);
