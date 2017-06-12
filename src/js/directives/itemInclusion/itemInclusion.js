// Purpose is to build promotion data.
app.directive('itemInclusion', ['itemsDataService', 'DataFactory', '$mdDialog',
    function (itemsDataService, DataFactory, $mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'itemInclusion.html',
            scope: {
                data: '=',
                purchaseoption: '=',
                itemtype: '=',
                promoform: '=',
                isDisabled: '=',
                viewProp: '='
            },
            controller: function ($scope) {
                $scope.$watch('purchaseoption', function (nv) {
                    if (nv) {

                        if (nv === 'itemsku') {
                            $scope.isSkuSearch = true;
                        } else {
                            $scope.isSkuSearch = false;
                        }
                    }
                });

            },
            link: function (scope) {

                var omsData = {};
                var skuData = {};
                var existingID = '';
                scope.searchResults = [];

                scope.isSkuSearch = false;
                scope.validOmsInfo = [];
                scope.validSkuInfo = [];
                scope.inValidOmsInfo = false;
                scope.inValidSkuInfo = false;
                scope.showInvalidError = false;

                function addItem(item) {

                    if (!scope.data) {
                        scope.data = [];
                    }
                    if (scope.data.indexOf(item.omsId) === -1) {
                        scope.validOmsInfo.push(item);
                        setData();
                    } else {
                        existingID += item.omsId + ', ';
                        DataFactory.messageModal.message = 'Following item/s are already added: ' + existingID
                        DataFactory.messageModal.title = 'Warning';
                        $('#messageModal').popup();
                    }

                }

                // function addSku(sku) {

                //     if (!scope.data) {
                //         scope.data = [];
                //     }
                //     if (scope.data.indexOf(sku.skuNumber) === -1) {
                //         scope.validSkuInfo.push(sku);
                //         setSkuData();
                //     } else {
                //         existingID += sku.skuNumber + ', ';

                //     }

                // }

                function setData() {
                    scope.itemtype = 'OMS';
                    scope.data = scope.validOmsInfo.reduce(function (data, item) {
                        return data.concat(item.omsId);
                    }, []);
                }

                function setSkuData() {
                    scope.itemtype = 'SKU';
                    scope.data = scope.validSkuInfo.reduce(function (data, sku) {
                        return data.concat(sku.skuNumber);
                    }, []);
                }

                function setItemData(data, clicked) {
                    existingID = '';

                    if (!scope.validOmsInfo.length && scope.data && !scope.itemSearch) {
                        $.extend(true, scope.validOmsInfo, data.validOmsInfo);
                    }

                    if (data.validOmsInfo && scope.itemSearch) {

                        for (var i = 0; i < data.validOmsInfo.length; i++) {
                            addItem(data.validOmsInfo[i]);
                        }
                    }

                    // if invalid Data set to item search
                    scope.itemSearch = (data.inValidOmsInfo) ? [data.inValidOmsInfo.toString().replace(/,/g, ' ')] : [];
                    scope.inValidOmsInfo = (scope.itemSearch.length > 0);
                    var invalidIds = data.inValidOmsInfo;
                    if (clicked && invalidIds && invalidIds.length > 0) {
                        DataFactory.messageModal.message = 'Following Items/OMS ID\'s are invalid: ' + invalidIds.toString();
                        DataFactory.messageModal.title = 'Warning';
                        $('#messageModal').popup();
                    }
                }
                // function setSkuValidData(data, clicked) {
                //     existingID = '';

                //     if (!scope.validSkuInfo.length && scope.data && !scope.itemSkuSearch) {
                //         $.extend(true, scope.validSkuInfo, data.validSkuInfo);
                //     }

                //     if (data.validSkuInfo && scope.itemSkuSearch) {
                //         for (var i = 0; i < data.validSkuInfo.length; i++) {
                //             addSku(data.validSkuInfo[i]);
                //         }
                //         if (existingID != '') {
                //             DataFactory.messageModal.message = 'Following Sku/s are already added: ' + existingID
                //             DataFactory.messageModal.title = 'Warning';
                //             $('#messageModal').popup();
                //         }
                //     }
                //     // if invalid Data set to item search
                //     scope.itemSkuSearch = (data.inValidSkuInfo) ? [data.inValidSkuInfo.toString().replace(/,/g, ' ')] : [];
                //     scope.inValidSkuInfo = (scope.itemSkuSearch.length > 0);
                //     var invalidIds = data.inValidSkuInfo;
                //     if (clicked && invalidIds && invalidIds.length > 0) {
                //         scope.showInvalidError = true;

                //     }
                // }

                function getItemsByID(data, clicked) {
                   
                    if (scope.isSkuSearch) {

                        var tempSkuData = {};

                        tempSkuData.skuNumbers = itemsDataService.getSkuIDs(data.skuIds)

                        var itemPromise = itemsDataService.getSkuIdCodes(tempSkuData);

                        itemPromise.then(
                            function (itemPromiseResult) {
                                DataFactory.messageModal.message = undefined;
                                //setSkuValidData(itemPromiseResult, clicked);
                                
                                if (itemPromiseResult.validSkuInfo && clicked != undefined && !DataFactory.messageModal.message) {
                                    showSkuTypeModal(itemPromiseResult);

                                }
                            },
                            function (error) {
                                DataFactory.messageModal.message = error;
                                DataFactory.messageModal.title = 'Error';
                                $('#messageModal').popup();
                            });
                    } else {

                        var tempData = {};
                        tempData.omsIds = itemsDataService.getOmsIDs(data.omsIds)
                        itemPromise = itemsDataService.getOmsIdCodes(tempData);

                        itemPromise.then(
                            function (data) {
                                setItemData(data, clicked);
                            },
                            function (error) {
                                DataFactory.messageModal.message = error;
                                DataFactory.messageModal.title = 'Error';
                                $('#messageModal').popup();
                            });
                    }

                }

                function showSkuTypeModal(itemPromiseResult) {
                    scope.modaldata = {};
                    scope.modaldata.itemPromiseResult= itemPromiseResult;
                    scope.modaldata.itemInclusionData = scope.data;
                    $mdDialog.show({
                        template: '<promo-sku-type-modal data="modaldata" filtered-sku-list-callback="$ctrl.filteredSkuListCallback(filteredSkuList)"></promo-sku-type-modal>',
                        parent: angular.element(document.body),
                        scope: scope,
                        preserveScope: true
                    })
                }

                function validateItemData(data) {
                    if (data.length == 0) {
                        scope.showInvalidError = true;
                        return;
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (/\s/g.test(data[i]) || /[a-z]/i.test(data[i])) {

                            scope.showInvalidError = true;
                            return;
                        }
                        if (!scope.isSkuSearch && data[i] && data[i].length != 9) {
                            scope.showInvalidError = true;
                            return;
                        }
                        scope.showInvalidError = false;
                    }
                }

                if (scope.data && scope.data.length) {

                    if (scope.itemtype == 'SKU') {
                        scope.isSkuSearch = true;
                    }
                    if (scope.isSkuSearch) {
                        skuData.skuIds = scope.data;
                        getItemsByID(skuData);
                    } else {
                        omsData.omsIds = scope.data;
                        getItemsByID(omsData);
                    }
                }
                scope.searchResults = [];


                scope.removePromoCode = function (index) {
                    if (scope.isSkuSearch) {
                        scope.validSkuInfo.splice(index, 1);
                        setSkuData();
                    } else {
                        scope.validOmsInfo.splice(index, 1);
                        setData();
                    }

                }

                function emptyCheck(data) {
                    if (!data || data == null || data == '') {
                        return true;
                    }
                }

                scope.search = function (data) {
                    if (emptyCheck(data)) {
                        if (scope.isSkuSearch) {
                            scope.dataEmpty = true;
                            DataFactory.messageModal.message = 'Please enter atleast one valid SKU Number to continue';
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                        } else {
                            scope.dataEmpty = true;
                            DataFactory.messageModal.message = 'Please enter Valid OMS Number';
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();

                        }
                    } else
                        if (scope.isSkuSearch) {
                            scope.dataEmpty = false;
                            data = data.replace(/\s\s+/g, ' ').split(/[',',' ',', ']+/);
                            validateItemData(data);
                            skuData.skuIds = data;
                        } else {
                            scope.dataEmpty = false;
                            data = data.replace(/\s\s+/g, ' ').split(/[',',' ',', ']+/);
                            validateItemData(data);
                            omsData.omsIds = data;

                        }

                    if (!scope.showInvalidError && !scope.dataEmpty) {
                        if (scope.isSkuSearch) {
                            getItemsByID(skuData, true);
                        } else {
                            getItemsByID(omsData, true);
                        }


                    }

                }
                scope.removeAll = function () {
                    if (scope.isSkuSearch) {
                        scope.validSkuInfo = [];
                        setSkuData();
                    } else {
                        scope.validOmsInfo = [];
                        setData();
                    }

                }
                scope.clear = function () {
                    if (scope.isSkuSearch) {
                        scope.inValidSkuInfo = false;
                    } else {
                        scope.inValidOmsInfo = false;
                    }

                }
            }
        };
    }
]);
