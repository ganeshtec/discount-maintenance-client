app.controller('promotionAdminCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'loginService', 'promotionDataService', 'PromotionData', 'SECTIONS', 'sectionsIndex', 'DataFactory', 'createTestRecord', 'URL_CONFIG', 'ALLOWED_PERMISSION_IDS',
    function ($scope, $rootScope, $routeParams, $timeout, $location, loginService, promotionDataService, PromotionData, SECTIONS, sectionsIndex, DataFactory, createTestRecord, URL_CONFIG, ALLOWED_PERMISSION_IDS) {

        var $this = this;

        var promotionID = $routeParams.id || null;
        var cloneId = $routeParams.cloneid || null;
        var promotionID2 = $routeParams.promotionID2 || null;
        var allowedPermissionIDs = ALLOWED_PERMISSION_IDS();
        $scope.sections = [];


        $scope.comparemode = (promotionID2) ? true : false;
        $scope.clonemode = (cloneId) ? true : false;
        $scope.urls = new URL_CONFIG();
        $scope.username = loginService.getUserName();

        $scope.userType = loginService.getCurrentUserRole();

        // Method to get promotion by id - Test Should return promotion record
        function getPromotionByID(id) {

            var getPromotionPromise = promotionDataService.getPromotionByID(id);
            getPromotionPromise.then(
                function (data) {
                    var promoData = new PromotionData($scope.userType);
                    $scope.promotionData = angular.extend(promoData, data);
                    if ($scope.clonemode) {
                        $scope.promotionData.origRequestId = data.promoId;
                        $scope.promotionData.promoId = 0;
                        //clear coupon id
                        delete $scope.promotionData.couponId;
                        //change the status to draft
                        $scope.promotionData.status = 20;
                        $scope.promotionData.name = 'Copy of ' + promoData.name;
                    } else {
                        $scope.promotionData.originalPrintLabel = data.printLabel;
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
            var promotionData = new PromotionData($scope.userType);
            promotionData.meta.created = $scope.username;
            promotionData.meta.lastUpdatedBy = $scope.username;
            $scope.promotionData = promotionData;
        }

        $this.setViewProperties = function (userType) {
            if (userType == allowedPermissionIDs.STORE) {
                $scope.viewProperties = {
                    displayDiscountType: false,
                    displayPromoDescription: false,
                    displayRedemptionLimits: false,
                    displayRedemptionMethod: false,
                    displayCombinationPromo: false,
                    displayOMSId: false,
                    displayMFGBrand: false,
                    displayWebHierarchy: false,
                    displayOMSIdExclusion: false,
                    displayExclusionSubCategories: false,
                    displayPaymentType: false,
                    displayScheduleTime: true,
                    displayPrintLabel: true,
                    displayLocations: true,
                    displayItemsSku: true,
                    displayMerchHiearchy: true,
                    displayCustomerSegment: true,
                    promotionSubTypesForMFA: true,
                    displayFilterSkuTypes: true,
                    displayBasketThreshold: true,
                    displayChannelSelect: true,
                    displayRapidPass: true,
                    displayLocation: true,
                    displayExclusiveCheckbox: true,
                    displayShowAllProDiscount: true,
                    displaySingleSkuBulk: true,
                    displayDiscountTemplate: true
                }
                //$scope.promotionSubTypesForMFA = true;
            } else if (userType == allowedPermissionIDs.ONLINE) {
                $scope.viewProperties = {
                    displayDiscountType: true,
                    displayPromoDescription: true,
                    displayRedemptionLimits: true,
                    displayRedemptionMethod: true,
                    displayCombinationPromo: true,
                    displayOMSId: true,
                    displayMFGBrand: true,
                    displayWebHierarchy: true,
                    displayOMSIdExclusion: true,
                    displayExclusionSubCategories: true,
                    displayPaymentType: true,
                    displayScheduleTime: true,
                    displayPrintLabel: false,
                    displayLocations: false,
                    displayItemsSku: false,
                    displayMerchHiearchy: false,
                    displayCustomerSegment: false,
                    promotionSubTypesForMFA: false,
                    displayFilterSkuTypes: false,
                    displayBasketThreshold: false,
                    displayChannelSelect: false,
                    displayRapidPass: false,
                    displayLocation: false,
                    displayExclusiveCheckbox: false,
                    displayShowAllProDiscount: false,
                    displaySingleSkuBulk: false,
                    displayDiscountTemplate: false
                }
                //$scope.promotionSubTypesForMFA = false;
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
        
        $scope.$watch('showSummaryTab', function (model) {
            $scope.sections[sectionsIndex.SUMMARY].shouldDisplay =  model;
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
