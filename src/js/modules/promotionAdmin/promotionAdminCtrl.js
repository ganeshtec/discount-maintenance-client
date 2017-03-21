app.controller('promotionAdminCtrl', ['$scope', '$routeParams', '$timeout', '$cookies', '$location', 'loginService', 'promotionDataService', 'PromotionData', 'SECTIONS', 'DataFactory', 'createTestRecord', 'URL_CONFIG', 'ALLOWED_PERMISSION_IDS',
    function ($scope, $routeParams, $timeout, $cookies, $location, loginService, promotionDataService, PromotionData, SECTIONS, DataFactory, createTestRecord, URL_CONFIG, ALLOWED_PERMISSION_IDS) {

        var $this = this;

        var promotionID = $routeParams.id || null;
        var cloneId = $routeParams.cloneid || null;
        // var promotionID1 = $routeParams.promotionID1 || null;
        var promotionID2 = $routeParams.promotionID2 || null;
        var allowedPermissionIDs = ALLOWED_PERMISSION_IDS();
        $scope.sections = [];

        $scope.comparemode = (promotionID2) ? true : false;
        $scope.clonemode = (cloneId) ? true : false;
        $scope.urls = new URL_CONFIG();

        if ($cookies.get('userName') != null && $cookies.get('userName') != '') {
            $scope.username = $cookies.get('userName');
        }

        if ($cookies.get('userPermissions') != null) {
            var userPermissions = JSON.parse($cookies.get('userPermissions'));
            $scope.userType = userPermissions[0]['id'];
        }

        // Method to get promotion by id - Test Should return promotion record
        function getPromotionByID(id) {

            var getPromotionPromise = promotionDataService.getPromotionByID(id);
            getPromotionPromise.then(
                function (data) {
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
                },
                function (error) {
                    DataFactory.messageModal.message = error;
                    DataFactory.messageModal.title = 'Error';
                    $('#messageModal').popup();
                });
        }

        function setPromoData() {
            $scope.promotionData = new PromotionData();
            $scope.promotionData.meta.created = $scope.username;
            $scope.promotionData.meta.lastUpdatedBy = $scope.username;
        }

        $this.setViewProperties = function(userType) {
            if (userType == allowedPermissionIDs.STORE) {
                $scope.viewProperties = getViewProperties(false);
            } else if (userType == allowedPermissionIDs.ONLINE) {
                $scope.viewProperties = getViewProperties(true);
            }
        }

        function getViewProperties(visibility) {
            return {
                displayPromoDescription: visibility,
                displayRedemptionLimits: visibility,
                displayRedemptionMethod: visibility,
                displayCombinationPromo: visibility,
                displayPriority: visibility,
                displayOMSId: visibility,
                displayMFGBrand: visibility,
                displayWebHierarchy: visibility,
                displayOMSIdExclusion: visibility,
                displayExclusionSubCategories: visibility,
                displayPaymentType: visibility,
                displayScheduleTime: visibility,
            }
        }

        // Initializes Data Model
        function init(data) {
            //checking the session validation.
            $scope.validData = {};
            $scope.messageModal = {};

            $scope.UiState = ($scope.comparemode) ? 'Compare' : ((data.promoId) ? 'Edit' : 'Create New');
            $scope.editMode = ($scope.UiState === 'Edit');
            
            $this.setViewProperties($scope.userType);

            $scope.sections = new SECTIONS($scope.userType);
            $scope.section = promotionDataService.getSection($scope.sections);
            $scope.sectionInx = $scope.sections.indexOf($scope.section);


            //get new data
            if (!$scope.editMode) {

                if ($scope.clonemode) {
                    getPromotionByID(data.promoId);
                } else if ($scope.comparemode) {
                    // getPromotionByID(data.promotionID1);
                    getPromotionByID(data.promotionID2);

                } else {
                    setPromoData();
                }
            }
            // get promotion record
            else {

                getPromotionByID(data.promoId);

                // End Testing Create
            }
        }

        // initialized promotion interface
        if ($scope.clonemode) {
            promotionID = cloneId;
        }
        init({
            promoId: promotionID
        });

        // Watch change in sections to set current section
        $scope.$watch('sections', function (model, oldModel) {
            if (model !== oldModel) {
                $scope.sectionInx = $scope.sections.indexOf(promotionDataService.getSection(model))
            }
        }, true);

        $scope.isEditable = function (promotion) {
            var editable = {
                '61': true, // active
                '57': true, // pending				
            }
            return editable[promotion.status]
        }
    }
]);
