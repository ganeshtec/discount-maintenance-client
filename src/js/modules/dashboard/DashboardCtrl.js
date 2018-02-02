app.controller('DashboardCtrl', ['$cookies', '$filter', 'leadTimeService', '$scope', 'DataFactory', 'promotionDataService', '$location', '$routeParams', '$mdDialog', 'dashboardDataService', 'OverlayConfigFactory', '$rootScope',
    function ($cookies, $filter, leadTimeService, $scope, DataFactory, promotionDataService, $location, routeParams, $mdDialog, dashboardDataService, OverlayConfigFactory, $rootScope) {

        $scope.$watchCollection('selected', function () {
            $scope.computeSelectedArray();
        });

        $scope.toggleAll = function () {
            if ($scope.selectAll) {
                $scope.selected = angular.extend({}, $scope.all);
            } else {
                $scope.selected = {};
            }
        }

        $scope.updatePage = function (no) {
            $location.search('page', no);
        };

        $scope.updateSize = function (size) {
            //move to page 1 when changing number of records per page

            var currentpage = $location.search().page || 1;
            var currentsize = $location.search().size || $scope.DEFAULT_RECORDS_PER_PG;

            var newPage = Math.floor((((currentpage - 1) * currentsize) / size) + 1);

            var params = $location.search();
            params.page = newPage;
            params.size = size;
            $location.search(params);
        };

        $scope.searchWithUrlParams = function () {
            var params = $location.search();
            $rootScope.searchParams = params;
            if($scope.userRoleSelected.id == 228){
                var promise = promotionDataService.getSelectionChannels($scope.userRoleSelected.id)
                promise.then(function (channels) {
                    params.channels = channels.map(function(channel) {
                        return channel.id
                    })
                    $scope.search(params.channels,
                        params.keyword || '',
                        params.page || 1,
                        params.size || $scope.DEFAULT_RECORDS_PER_PG,
                        params.status || 'all',
                        params.type || 'all',
                        params.sortby || 'none',
                        params.order || 'asc',
                        params.searchType || 'discountName'
                    );
                })
            } else {
                $scope.search(params.channels,
                    params.keyword || '',
                    params.page || 1,
                    params.size || $scope.DEFAULT_RECORDS_PER_PG,
                    params.status || 'all',
                    params.type || 'all',
                    params.sortby || 'none',
                    params.order || 'asc',
                    params.searchType || 'discountName')
            }
        }

        $scope.computeSelectedArray = function () {
            var keys = Object.keys($scope.selected);
            $scope.sel = []
            for (var i = 0; i < keys.length; i++) {
                if ($scope.selected[keys[i]]) {
                    $scope.sel.push(keys[i]);
                } else {
                    $scope.selectAll = false;
                }
            }
            if (Object.keys($scope.selected).length != Object.keys($scope.all).length) {
                $scope.selectAll = false;
            }
            $scope.selectedCount = $scope.sel.length;
        }

        $scope.updateKeyword = function () {
            var params = $location.search();
            if ($scope.searchTerm == params.keyword && $scope.searchType == params.searchType) {
                $scope.searchWithUrlParams();
            } else {
                $scope.errorMessage = ' ';
                params.keyword = $scope.searchTerm;
                params.searchType = $scope.searchType;
                params.page = 1;

                $location.search(params);
            }
        }

        $scope.searchTypeChanged = function () {
            $scope.searchTerm = '';
        }

        $scope.refresh = function () {
            $scope.searchWithUrlParams();
        }

        $scope.clearSearch = function () {
            
            $scope.searchTerm = '';
            $scope.searchType = 'discountName'
            
            var channelList = [];
            channelList.push($scope.channelId);
            var params = {
                'keyword': $scope.searchTerm,
                'searchType': $scope.searchType,
                'page': 1,
                'size': $scope.DEFAULT_RECORDS_PER_PG,
                'channels': channelList
            }
            $location.search(params);
        }

        var checkForValid = function (data) {
            var valid = data.validData;
            var invalid = data.invalidData;
            var resp = {};
            if (valid && valid.length > 0) {
                resp.valid = []
                for (var i = 0; i < valid.length; i++) {
                    resp.valid.push(valid[i].promoId);
                }
            }
            if (invalid && invalid.length > 0) {
                resp.invalid = []
                for (var j = 0; j < invalid.length; j++) {
                    var promos = {};
                    promos.id = invalid[j].invalidInput.promoId;

                    //Displaying  invalid id and not the actual message
                    resp.invalid.push(promos.id);
                }
            }
            return resp;
        }

        $scope.save = function () {

            var promotions = $scope.promotions;
            var req = [];
            var dupcheck = {};
            for (var j = 0; j < promotions.length; j++) {
                var promotionData = promotions[j];
                var promotion = promotionData.promotion;
                if ($scope.selected[promotion.promoId]) {
                    promotion.meta.action = 'update';
                    promotion.startDt = $filter('date')(promotionData.start, 'yyyy-MM-dd HH:mm:ss');
                    promotion.endDt = $filter('date')(promotionData.end, 'yyyy-MM-dd HH:mm:ss');
                    if (!dupcheck[promotion.promoId]) {
                        req.push(promotion);
                        dupcheck[promotion.promoId] = true;
                    }
                }
            }
            var promotionPromise = promotionDataService.savePromotions(req);
            $scope.loading = true;
            promotionPromise.then(
                function (data) {
                    var resp = checkForValid(data);
                    if (resp.valid && !resp.invalid) {
                        showAlert('Success', 'Saved successfully', $scope.refresh);
                    } else if (resp.invalid) {
                        showAlert('Error', 'Unable to save discounts :' + JSON.stringify(resp.invalid));
                    }
                    $scope.loading = false;
                },
                function () {
                    $scope.loading = false;
                    showAlert('Error', 'Unable to save');
                }
            );
        }

        var showAlert = function (title, content, onClose) {
            var options = $mdDialog.alert()
                .title(title)
                .textContent(content)
                .ok('Ok');
            if (onClose) {
                onClose();
            }
            $mdDialog.show(options);
        }

        var showConfirm = function (title, content) {
            var options = $mdDialog.confirm()
                .title(title)
                .textContent(content)
                .ok('Ok')
                .cancel('Cancel');
            return options;
        }

        $scope.delete = function () {
            var sel = $scope.selected;
            var promotions = $scope.promotions;
            var req = []
            for (var i = 0; i < promotions.length; i++) {
                var promotionData = promotions[i];
                var promo = promotionData.promotion;
                if (sel[promo.promoId]) {
                    req.push(promo);
                }
            }
            var options = showConfirm('Warning', 'Discount will be deleted permanently');
            $mdDialog.show(options).then(function () {
                var promotionPromise = promotionDataService.delete(req);
                $scope.loading = true;
                promotionPromise.then(
                    function (data) {
                        var resp = checkForValid(data);
                        if (resp.valid) { /*if multiple promos are selected for delete then */
                            showAlert('Success', 'Deleted successfully :' + JSON.stringify(resp.valid), $scope.searchWithUrlParams);
                        }
                        if (resp.invalid) {
                            showAlert('Error', 'Unable to delete discounts :' + JSON.stringify(resp.invalid).replace(/[{}\\]/g, ''));
                        }
                        $scope.loading = false;
                    },
                    function () {
                        showAlert('Error', 'Unable to delete');
                        $scope.loading = false;
                    }
                )
            });
        }

        $scope.isInLeadTime = function (endDate, leadTime) {
            var today = new Date();
            var leadTimeSec = leadTime * 24 * 60 * 60 * 1000;
            if (endDate.getTime() - today.getTime() <= leadTimeSec) {
                return true;
            } else {
                return false;
            }
        }

        $scope.eligibleLabelForDeactivate = function (labelFlag, status, inLeadTime) {
            if (labelFlag == true && status == 61 && !inLeadTime) {
                return true;
            } else {
                return false;
            }
        }

        $scope.cannotBeDeactivated = function (labelFlag, status, inLeadTime) {
            if (labelFlag && status == 61 && inLeadTime) {
                return true;
            } else {
                return false;
            }
        }

        $scope.activeWithNoLabelDiscount = function (labelFlag, status) {
            if (labelFlag == false && status == 61) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.updatePromoEndDateTomorrow = function (promo) {
            var today = new Date();
            var newDate = today.setDate(today.getDate() + 1);
            promo.endDt = $filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss')
            promo.status = 64;
            promotionDataService.saveAsDraft(promo);
        }

        $scope.isPromoStatusPending = function (status) {
            if (status == 57) {
                return true;
            }
            else {
                return false;
            }
        }


        $scope.updateEndDateForPendingDiscount = function (promo) {
            promo.endDt = promo.startDt;
            promo.status = 64;
            promotionDataService.saveAsDraft(promo);
        }

        $scope.constructAndSavePromo = function (leadTime, promo) {
            var today = new Date();
            var newEndDate = new Date();
            newEndDate.setDate(today.getDate() + leadTime);
            promo.endDt = $filter('date')(newEndDate, 'yyyy-MM-dd HH:mm:ss');
            var promise = promotionDataService.saveAsDraft(promo);
            promise.then(
                function (data) {
                    promotionDataService.submit(data.data);
                }
            )
        }

        $scope.deactivate = function () {
            var promoPromise = promotionDataService.getPromotionByID($scope.sel[0]);
            var leadTimePromise = leadTimeService.fetchLeadTime();
            var promo;
            var inLeadTime;
            var endDate;
            promoPromise.then(function (data) {
                promo = data;
                endDate = new Date(data.endDt);
                leadTimePromise.then(function (leadTime) {
                    inLeadTime = $scope.isInLeadTime(endDate, leadTime);
                    if ($scope.eligibleLabelForDeactivate(promo.printLabel, promo.status, inLeadTime)) {
                        $scope.constructAndSavePromo(leadTime, promo);
                        // call another one for transmit
                        // as part of savePromo in WS do Transmit call

                        showAlert('Success', promo.name + ' will end on ' + promo.endDt.split(' ')[0] + ' to account for labeling lead time.');
                        return;
                    } if ($scope.cannotBeDeactivated(promo.printLabel, promo.status, inLeadTime)) {
                        showAlert('Failure', 'This discount is already scheduled to end on ' + promo.endDt.split(' ')[0] + ' and cannot be deactivated earlier due to the time to remove labels.');
                        return;
                    } else {
                        if ($scope.activeWithNoLabelDiscount(promo.printLabel, promo.status)) {
                            $scope.updatePromoEndDateTomorrow(promo);
                            $scope.deactivatePromotions();
                        }
                        else if ($scope.isPromoStatusPending(promo.status)) {
                            $scope.updateEndDateForPendingDiscount(promo);
                            $scope.deactivatePromotions();
                        }
                        else {
                            $scope.deactivatePromotions();
                        }
                    }
                })
            })
        };


        $scope.deactivatePromotions = function () {
            var deactivatePromise = promotionDataService.deactivate($scope.sel[0]);
            $scope.loading = true;
            deactivatePromise.then(function (data) {
                var resp = checkForValid(data);
                if (resp.valid && !resp.invalid) {
                    showAlert('Success', 'Deactivated successfully', $scope.searchWithUrlParams);
                } else if (resp.invalid) {
                    showAlert('Error', 'Unable to deactivate discount :' + JSON.stringify(resp.invalid));
                }
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                $scope.searchWithUrlParams();
            })
        }

        $scope.setupSortableHeader = function () {
            $scope.headers = [{
                'sortId': 'promoId',
                'text': 'Id',
                'width': '3%'
            },
            {
                'sortId': 'name',
                'text': 'Discount Name',
                'width': '25%'
            },
            {
                'sortId': 'statusName',
                'text': 'Status',
                'width': '5%'
            },
            {
                'sortId': 'promoSubTypeDesc',
                'text': 'Discount Type',
                'width': '8%'
            },
            {
                'sortId': 'startDate',
                'text': 'Start Date',
                'width': '5%'
            },
            {
                'sortId': 'endDate',
                'text': 'End Date',
                'width': '5%'
            },
            {
                'sortId': 'createdBy',
                'text': 'Created By',
                'width': '5%'
            },
            {
                'sortId': 'lastModifiedBy',
                'text': 'Last Modified (ID/Date)',
                'width': '12%'
            },
            {
                'sortId': 'priority',
                'text': 'Priority',
                'width': '4%'
            }
            ];
        }

        $scope.canSave = function () {
            if ($scope.selectedCount == 0) {
                return false;
            }
            var modifiedFields = $('.promotions .ng-invalid');
            var promoId = $(field).parent().parent().data('promoid');
            for (var i = 0; i < modifiedFields.length; i++) {
                var field = modifiedFields[i];
                if ($scope.selected[promoId]) {
                    return false;
                }
            }
            var disabledFields = angular.element('.promotions input[disabled]');
            for (var j = 0; j < disabledFields.length; j++) {
                field = disabledFields[j];
                if ($scope.selected[promoId]) {
                    return false;
                }
            }
            return true;
        }

        $scope.search = function (channels, keyword, curPage, pageSize, status, type, sortby, order, searchType) {
            //clear all selected items when moving away from page
            $scope.selected = {};
            var promotionPromise = promotionDataService.getPromotions(channels, keyword, curPage - 1, pageSize, status, type, sortby, order, searchType);
            //set mask to indicate progress and prevent further operations
            $scope.loading = true;
            promotionPromise.then(
                function (data) {
                    var promotions = data.results || [];
                    var wrappers = [];
                    var all = {};
                    for (var i = 0; i < promotions.length; i++) {
                        var wrapper = {};
                        wrapper.promotion = promotions[i];
                        wrapper.start = new Date(promotions[i].startDt.split(' ')[0].replace(/-/g, '\/'));
                        wrapper.end = new Date(promotions[i].endDt.split(' ')[0].replace(/-/g, '\/'));
                        if (wrapper.end.getFullYear() == 9999 
                        && wrapper.end.getDate() == 31 
                        // Get month starts at 0 index for January, 11 is December
                        && wrapper.end.getMonth() == 11) {
                            wrapper.noEndDate = true;
                            wrapper.end = 'No end date';
                        }
                        wrapper.disabled = !$scope.isEditable(promotions[i]);
                        wrappers.push(wrapper);
                        all[promotions[i].promoId] = true;
                    }
                    $scope.promotions = wrappers;

                    $scope.paginationConfig.recordsPerPage = data.criteria.page.size + '';
                    $scope.paginationConfig.currentPage = parseInt(curPage);
                    $scope.paginationConfig.totalRecords = data.totalCount || 0;
                    $scope.paginationReq = $scope.paginationConfig.totalRecords > $scope.LEAST_RECORDS_PER_PG;
                    $scope.nodata = parseInt(data.totalCount || 0) === 0;
                    $scope.loading = false;
                    $scope.filterstatus = status;
                    $scope.filtertype = type;

                    $scope.dataLoaded = true;

                },
                function () {
                    $scope.loading = false;
                }
            );
        }

        function getPromoSubTypes() {
            var getPromotionPromise = promotionDataService.getPromotionSubTypes();
            getPromotionPromise.then(
                function (data) {
                    DataFactory.promotionSubTypes = data.promotionSubTypes;
                    $scope.promoList = DataFactory.promotionSubTypes;
                    $scope.promoSubTypes = setPromoTypes();
                },
                function (error) {
                    DataFactory.messageModal.message = error;
                    DataFactory.messageModal.title = 'Error';
                    $('#messageModal').popup();

                });
        }

        function setPromoTypes() {
            var promotionSubTypes = {};
            for (var i = 0; i < DataFactory.promotionSubTypes.length; i++) {
                var subType = DataFactory.promotionSubTypes[i];
                promotionSubTypes[subType.promoSubTypeCd] = subType.promoSubTypeDesc;
            }
            return promotionSubTypes;
        }

        // this gets triggered whenever the url changes ,see app.js for route configuration
        $scope.$on('$routeUpdate', function () {
            $scope.searchWithUrlParams();
        });
        $scope.edit = function (id) {
            window.location = '#/discount-admin/' + (id || $scope.sel[0]);
        }
        $scope.duplicate = function (id) {
            window.location = '#/discount-admin/clone/' + (id || $scope.sel[0]);
        }

        $scope.compare = function (id1, id2) {
            window.location = '#/discount-admin/compare/' + (id1 || $scope.sel[0]) + '/' + (id2 || $scope.sel[1]);
        }
        // check is only for editing inline from dashboard, promotions that are Active/Pending can still be edited from the main page
        $scope.isEditable = function (promotion) {
            var editable = {
                '20': true,
                '72': true
            }
            return editable[promotion.status]
        }
        $scope.filter = function () {
            var params = {};
            params.keyword = $scope.searchTerm;
            params.searchType = $scope.searchType;
            params.type = $scope.filtertype;
            params.status = $scope.filterstatus;
            $location.search(params);
        }
        $scope.sort = function (sortId) {
            var params = $location.search();
            params.sortby = sortId;
            $scope.sortby = sortId;
            if (params.sortby == sortId) {
                params.order = (params.order == 'asc') ? 'desc' : 'asc';
            } else {
                params.order = 'asc';
            }

            $scope.order = params.order;
            $location.search(params);
        }

        $scope.selectedPromotions = [];
        $scope.setPromotionToView = function (id) {

            $scope.promotionData = dashboardDataService.getPromotionFromList($scope.promotions, id);
            $scope.$broadcast('horizontalTabClicked');

        };

        //only active promotions can be deactived and cannot be deleted
        $scope.isActive = function () {
            var promotion = null;
            var promotions = $scope.promotions;
            if ($scope.sel.length == 0) {
                return false;
            }
            for (var i = 0; i < promotions.length; i++) {
                var promotionData = promotions[i];
                var promo = promotionData.promotion;
                if ($scope.sel[0] == promo.promoId) {
                    promotion = promotions[i].promotion;
                }
            }
            var active = {
                '61': true, // active
                '57': true, // pending
            }
            $scope.toDeactivate = active[promotion.status];
            return active[promotion.status];
        };
        // at least one of the selected promotion is active
        $scope.hasActive = function () {
            var promotions = $scope.promotions;
            if ($scope.sel.length == 0) {
                return false;
            }
            var active = {
                '61': true, // active
                '57': true, // pending
            }
            for (var i = 0; i < promotions.length; i++) {
                var promotionData = promotions[i];
                var promo = promotionData.promotion;
                if ($scope.selected[promo.promoId] && active[promo.status]) {
                    return true
                }
            }
            return false;
        }

        // Initialize dashboard with default values, call default search
        $scope.initializeDashboard = function () {

            $scope.dataLoaded = false;

            $scope.DEFAULT_RECORDS_PER_PG = 10;
            $scope.LEAST_RECORDS_PER_PG = 5; //smallest value in the records per page selectbox 
            $scope.all = {};
            $scope.selected = {};
            $scope.selectedCount = 0;
            $scope.sel = [];
            $scope.userRoleSelected = {
                id: null,
            }
            
            $scope.channelId = [];

            // Set Channel ID based on logged in user role
            if ($cookies.get('currentUserRole') != null) {
                $scope.userRoleSelected.id = parseInt($cookies.get('currentUserRole'));
                if ($scope.userRoleSelected.id == 229) {
                    $scope.channelId = 57;
                }
                else if ($scope.userRoleSelected.id == 228) {
                    $scope.channelId = 87;
                }
            }
            
            if ($rootScope.searchParams) {
                var params = $rootScope.searchParams;

                $scope.searchTerm = params.keyword;
                $scope.searchType = params.searchType;

                $location.search(params);
            }else{
                $scope.clearSearch();
            }
 
            $scope.browseCatalogOverlayConfig = OverlayConfigFactory.getInstance();
            $scope.setupSortableHeader();
            // inital value of the select all check box
            $scope.selectAll = false;
            $scope.paginationConfig = {};
            
            // Default Search on Load - all status
            if($scope.dataLoaded == false) {
                $scope.searchWithUrlParams();
            }

            var statusPromise = promotionDataService.getAllStatus();
            $scope.status = {};
            statusPromise.then(
                function (data) {
                    $scope.statusList = data.promotionStatus
                    var statusData = data.promotionStatus;
                    for (var i = 0; i < statusData.length; i++) {
                        var status = statusData[i];
                        $scope.status[status.promoStatusCd] = status.promoStatusDesc || '';
                    }
                },
                function () { }
            )
            if (DataFactory.promotionSubTypes) {
                $scope.promoSubTypes = setPromoTypes();
            } else {
                getPromoSubTypes();
            }
        }

        // Instantiate with defaults
        $scope.initializeDashboard();
    }
]);
