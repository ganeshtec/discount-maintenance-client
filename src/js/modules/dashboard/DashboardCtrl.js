app.controller('DashboardCtrl', ['$filter', 'leadTimeService', '$scope', 'DataFactory', 'promotionDataService', '$location', '$routeParams', '$mdDialog', 'dashboardDataService', 'OverlayConfigFactory',
    function ($filter, leadTimeService, $scope, DataFactory, promotionDataService, $location, routeParams, $mdDialog, dashboardDataService, OverlayConfigFactory) {
        var DEFAULT_RECORDS_PER_PG = 10,
            LEAST_RECORDS_PER_PG = 5; //smallest value in the records per page selectbox 
        $scope.selected = {};
        $scope.selectedCount = 0;
        $scope.sel = [];
        $scope.browseCatalogOverlayConfig = OverlayConfigFactory.getInstance();
        // inital value of the select all check box
        $scope.selectAll = false;
        var all = {};
        $scope.$watchCollection('selected', function () {
            $scope.computeSelectedArray();
        });
        $scope.paginationConfig = {};

        $scope.toggleAll = function () {
            if ($scope.selectAll) {
                $scope.selected = angular.extend({}, all);
            } else {
                $scope.selected = {};
            }
        }

        $scope.updatePage = function (no) {
            $location.search('page', no);
        };
        $scope.updateSize = function (size) {
            //move to page 1 when changing number of records per page
            var params = {
                'page': 1,
                'size': size
            }
            $location.search(params);
        };
        $scope.searchWithUrlParams = function () {
            var params = $location.search();
            $scope.promotionName = params.keyword || '';
            $scope.search(params.keyword || '',
                params.page || 1,
                params.size || DEFAULT_RECORDS_PER_PG,
                params.status || 'all',
                params.type || 'all',
                params.sortby || 'none',
                params.order || 'asc'
            );
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
            if (Object.keys($scope.selected).length != Object.keys(all).length) {
                $scope.selectAll = false;
            }
            $scope.selectedCount = $scope.sel.length;
        }
        $scope.updateKeyword = function () {
            if (!$scope.promotionName) {
                $scope.errorMessage = 'Promotion name is mandatory'
            } else {
                var current = $location.search();
                if ($scope.promotionName == current.keyword) {
                    $scope.searchWithUrlParams();
                } else {
                    $scope.errorMessage = ' ';
                    var params = {
                        'keyword': $scope.promotionName,
                        'page': 1
                    }
                    $location.search(params);
                }
            }
        }
        $scope.refresh = function () {
            var current = $location.search();
            if (current.page == 1 && current.size == DEFAULT_RECORDS_PER_PG) {
                $scope.searchWithUrlParams();
            } else {
                var params = {
                    'keyword': '',
                    'page': 1,
                    'size': DEFAULT_RECORDS_PER_PG
                }
                $location.search(params);
            }

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
                        showAlert('Error', 'Unable to save promotions :' + JSON.stringify(resp.invalid));
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

            var options = showConfirm('Warning', 'Promotion will be deleted permanently');
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
                            showAlert('Error', 'Unable to delete promotions :' + JSON.stringify(resp.invalid).replace(/[{}\\]/g, ''));
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

        $scope.isInLeadTime = function(endDate, leadTime) {
            var today = new Date();
            if (endDate.getDate() - today.getDate() <= leadTime){
                return true;
            } else {
                return false;
            }
        }

        $scope.eligibleLabelForDeactivate = function(labelFlag, status, inLeadTime) {
            if (labelFlag == true && status == 61 && !inLeadTime) {
                return true;
            } else {
                return false;
            }
        }

        $scope.cannotBeDeactivated = function(labelFlag, status, inLeadTime) {
            if (labelFlag && status == 61 && inLeadTime) {
                return true;
            } else {
                return false;
            }
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
                leadTimePromise.then(function (data) {
                    inLeadTime = $scope.isInLeadTime(endDate, data);
                    if ($scope.eligibleLabelForDeactivate(promo.printLabel, promo.status, inLeadTime)) {
                        var today = new Date();
                        var newEndDate = new Date();
                        newEndDate.setDate(today.getDate() + data);
                        promo.endDt = $filter('date')(newEndDate, 'yyyy-MM-dd HH:mm:ss');
                        promotionDataService.saveAsDraft(promo);
                        showAlert('Success', promo.name + ' will end on ' + promo.endDt.split(' ')[0] + ' to account for labeling lead time.', $scope.searchWithUrlParams);
                        return;
                    } if ($scope.cannotBeDeactivated(promo.printLabel, promo.status, inLeadTime)) {
                        showAlert('Failure', 'This discount is already scheduled to end on ' + promo.endDt.split(' ')[0] + ' and cannot be deactivated earlier due to the time to remove labels.', $scope.searchWithUrlParams);
                    } else {
                        var deactivatePromise = promotionDataService.deactivate($scope.sel[0]);
                        $scope.loading = true;
                        deactivatePromise.then(function (data) {
                            var resp = checkForValid(data);
                            if (resp.valid && !resp.invalid) {
                                showAlert('Success', 'Deactivated successfully', $scope.searchWithUrlParams);
                            } else if (resp.invalid) {
                                showAlert('Error', 'Unable to deactivate promotion :' + JSON.stringify(resp.invalid));
                            }
                            $scope.loading = false;
                        }, function () {
                            $scope.loading = false;
                            $scope.searchWithUrlParams();
                        })
                    }
                })
            })
        };

        $scope.setupSortableHeader = function () {
            $scope.headers = [{
                'sortId': 'promoId',
                'text': 'Id',
                'width': '3%'
            },
            {
                'sortId': 'name',
                'text': 'Promotion Name',
                'width': '25%'
            },
            {
                'sortId': 'statusName',
                'text': 'Status',
                'width': '5%'
            },
            {
                'sortId': 'promoSubTypeDesc',
                'text': 'Promotion Type',
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
        $scope.search = function (keyword, curPage, pageSize, status, type, sortby, order) {
            //clear all selected items when moving away from page
            $scope.selected = {};
            var promotionPromise = promotionDataService.getPromotions(keyword, curPage - 1, pageSize, status, type, sortby, order);
            //set mask to indicate progress and prevent further operations
            $scope.loading = true;
            promotionPromise.then(
                function (data) {
                    var promotions = data.results || [];
                    var wrappers = [];
                    all = {};
                    for (var i = 0; i < promotions.length; i++) {
                        var wrapper = {};
                        wrapper.promotion = promotions[i];
                        wrapper.start = new Date(promotions[i].startDt.split(' ')[0].replace(/-/g, '\/'));
                        wrapper.end = new Date(promotions[i].endDt.split(' ')[0].replace(/-/g, '\/'));
                        wrapper.disabled = !$scope.isEditable(promotions[i]);
                        wrappers.push(wrapper);
                        all[promotions[i].promoId] = true;
                    }
                    $scope.promotions = wrappers;

                    $scope.paginationConfig.recordsPerPage = data.criteria.page.size + '';
                    $scope.paginationConfig.currentPage = parseInt(curPage);
                    $scope.paginationConfig.totalRecords = data.totalCount || 0;
                    $scope.paginationReq = $scope.paginationConfig.totalRecords > LEAST_RECORDS_PER_PG;
                    $scope.nodata = parseInt(data.totalCount || 0) === 0;
                    $scope.loading = false;
                    $scope.filterstatus = status;
                    $scope.filtertype = type;
                },
                function () {
                    $scope.loading = false;
                }
            );
        }
        // search based on url params
        $scope.searchWithUrlParams();
        //get all status
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



        // var promoPromise = promotionDataService.getPromotionSubTypes();
        if (DataFactory.promotionSubTypes) {
            $scope.promoSubTypes = setPromoTypes();
        } else {
            getPromoSubTypes();
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
            window.location = '#/promotion-admin/' + (id || $scope.sel[0]) + '#promoTop';
        }
        $scope.duplicate = function (id) {
            window.location = '#/promotion-admin/clone/' + (id || $scope.sel[0]) + '#promoTop';
        }

        $scope.compare = function (id1, id2) {
            window.location = '#/promotion-admin/compare/' + (id1 || $scope.sel[0]) + '/' + (id2 || $scope.sel[1]);
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

        $scope.setupSortableHeader();
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
    }
]);
