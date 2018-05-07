//Merch Hierarchy 
app.directive('merchHierarchyView', ['merchHierarchyDataService', 'DataFactory', 'OverlayConfigFactory', '$mdDialog', 'validationService', '$rootScope', 'skuTypesDataService',

    function (merchHierarchyDataService, DataFactory, OverlayConfigFactory, $mdDialog, validationService, $rootScope, skuTypesDataService) {
        return {
            restrict: 'E',
            templateUrl: 'merchHierarchyView.html',
            scope: {
                data: '=',
                promoform: '=',
                isDisabled: '=',
                source: '=',
                promoStatus: '=',
                preview: '=',
                scopedata: '=',
                inclusiontype: '='
            },
            link: function (scope) {
                var delimeter = '>>';
                scope.deps = [];
                scope.data = $.extend(true, [], scope.data);
                scope.tableData = $.extend(true, [], scope.tableData);
                scope.selectedSubClasses = [];
                scope.browseCatalogOverlayConfig = OverlayConfigFactory.getInstance();
                scope.browseCatalogOverlayConfig.mask(true);
                scope.notifyCompletion = '';

                scope.getAllDepartments = getAllDepartments;
                scope.getClassesforSelectedDepartment = getClassesforSelectedDepartment;
                scope.getSubClasses = getSubClasses;
                scope.prepareJsondata = prepareJsondata;
                scope.showData = showData;
                scope.checkForDuplicateEntry = checkForDuplicateEntry;
                scope.deleteRow = deleteRow;
                scope.deleteAllRows = deleteAllRows;
                scope.validatePromotion = validatePromotion;
                scope.showSkuTypeModal = showSkuTypeModal;
                scope.isSkuExcluded = isSkuExcluded;
                scope.scopedata.merchTableData[scope.inclusiontype] = scope.tableData;
                scope.getAllDepartments();

                if (scope.data && scope.data.length > 0) {
                    for (var i = 0; i < scope.data.length; i++) {
                        if (scope.data[i].catalog === 'Merch') {
                            var merchNames = scope.data[i].name.split(delimeter);
                            var merchIds = scope.data[i].id.split(delimeter);
                            var merchData = {
                                'dept': merchNames[0],
                                'clas': merchNames[1],
                                'subClass': merchNames[2],
                                'deptNum': merchIds[0],
                                'clasNum': merchIds[1],
                                'subClasNum': merchIds[2]
                            }
                            scope.tableData.push(merchData);
                        }
                    }
                }

                skuTypesDataService.fetchSkuTypes().then(function (skuTypes) {
                    var selectedSku = '';
                    angular.forEach(skuTypes, function (skuType) {
                        if (!isSkuExcluded(scope.source.exclusions.attrs, skuType)) {
                            selectedSku += ', ' + skuType.skuTypeCode;
                        }
                    })
                    scope.source.selectedSku = selectedSku.length > 0 ? selectedSku.substring(1) : '';
                });

                function isSkuExcluded(attrs, skuType) {
                    var isExcluded = false;
                    angular.forEach(attrs, function (attr) {
                        if (attr.value == skuType.skuTypeCode) {
                            isExcluded = true;
                            return;
                        }
                    })
                    return isExcluded;
                }

                $rootScope.$on('clearCategories', function () {
                    scope.deleteAllRows();

                    scope.selectedDept = null;
                    scope.selectedClass = null;
                    scope.selectedSubClasses = [];

                    scope.classList = [];
                    scope.SubClassList = [];
                });

                $rootScope.$on('refreshSkuTypeValidations', function () {
                    scope.validatePromotion();
                });

                function getAllDepartments() {
                    var getDepartementsPromise = merchHierarchyDataService.getAllDepartments();
                    getDepartementsPromise.then(
                        function (data) {
                            scope.departmentListfromWebservice = data.merchDepartments;
                            // START
                            var objearraySize = scope.departmentListfromWebservice.length;
                            scope.departmentDetails = [];
                            for (var i = 0; i < objearraySize; i++) {
                                var department = {};

                                department.id = scope.departmentListfromWebservice[i].departmentNumber;
                                department.name = scope.departmentListfromWebservice[i].departmentName;
                                scope.departmentDetails.push(department);
                            }
                            //END
                        },
                        function () { }
                    );
                }
                // Classes code STARTs
                function getClassesforSelectedDepartment() {
                    scope.classList = [];
                    scope.SubClassList = [];
                    if (scope.selectedDept && scope.selectedDept != null) {
                        scope.merchDataLoading = true;
                        var getClassesPromise = merchHierarchyDataService.getAllClasses(scope.selectedDept.id);
                        getClassesPromise.then(
                            function (classdata) {
                                scope.classListfromWS = classdata.merchClasses;
                                var classArraySize = scope.classListfromWS.length;

                                for (var j = 0; j < classArraySize; j++) {
                                    var classObject = {};
                                    classObject.merchandiseClassNumber = scope.classListfromWS[j].merchandiseClassNumber;
                                    classObject.merchandiseClassDescription = scope.classListfromWS[j].merchandiseClassDescription;
                                    scope.classList.push(classObject);
                                }

                                scope.merchDataLoading = false;
                            },
                            function () {
                                scope.merchDataLoading = false;
                            });
                    }
                }
                // getSubClassess Method - START
                function getSubClasses() {

                    scope.SubClassList = [];
                    scope.selectedSubClasses = [];
                    if (scope.selectedClass && scope.selectedClass != null) {
                        scope.merchDataLoading = true;
                        var getSubClassesPromise = merchHierarchyDataService.getSubClasses(scope.selectedDept.id, scope.selectedClass.merchandiseClassNumber);
                        getSubClassesPromise.then(
                            function (subClassdata) {
                                scope.SubClassListfromWS = subClassdata.merchSubClasses;
                                var classArraySize = scope.SubClassListfromWS.length;

                                for (var j = 0; j < classArraySize; j++) {
                                    var SubClassObject = {};
                                    SubClassObject.merchandiseSubordinateClassNumber = scope.SubClassListfromWS[j].merchandiseSubordinateClassNumber;
                                    SubClassObject.merchandiseSubordinateClassDescription = scope.SubClassListfromWS[j].merchandiseSubordinateClassDescription;
                                    scope.SubClassList.push(SubClassObject);

                                }
                                scope.merchDataLoading = false;
                            },
                            function () {
                                scope.merchDataLoading = false;
                            });
                    }
                }
                // getSubClassess Method - END

                function prepareJsondata(dataObject) {
                    var dcsId = '';
                    if (dataObject) {
                        var dptNum = dataObject.deptNum || '';
                        var clasNum = dataObject.clasNum || '';
                        var subClasNum = dataObject.subClasNum || '';
                        dcsId = dptNum + delimeter + clasNum + delimeter + subClasNum;
                    }
                    return dcsId;
                }

                function showData() {
                    if (scope.selectedDept == null) {
                        DataFactory.messageModal.message = 'No Department Selected, Please select  Department';
                        DataFactory.messageModal.title = 'Warning';
                        $('#messageModal').popup();
                    } else {
                        var isTableDataEmpty = scope.tableData.length === 0;


                        if (scope.selectedClass == null) {
                            scope.selectedClass = {
                                merchandiseClassDescription: '',
                                merchandiseClassNumber: ''
                            }
                        }
                        if (scope.selectedSubClasses.length == 0) {
                            if (scope.selectedSubClass == null) {
                                scope.selectedSubClass = {
                                    merchandiseSubordinateClassDescription: '',
                                    merchandiseSubordinateClassNumber: ''
                                }
                            }
                            addData(scope.selectedSubClass);
                        }

                        angular.forEach(scope.selectedSubClasses, function (subClass) {
                            addData(subClass);
                            //subClass.hide = true;
                            subClass.checked = false;
                        });
                        scope.selectedSubClasses.splice(0, scope.selectedSubClasses.length);
                        scope.notifyCompletion = '' + Math.random();
                        if (isTableDataEmpty) {
                            scope.showSkuTypeModal();
                        }
                    }
                }

                function addData(subClass) {
                    var duplicatecheck = checkForDuplicateEntry(subClass);
                    if (duplicatecheck) {
                        DataFactory.messageModal.message = 'Duplicate Entry Please Select Another Combination:';
                        DataFactory.messageModal.title = 'Warning';
                        $('#messageModal').popup();
                    } else {
                        var className = scope.selectedClass == null ? '' : scope.selectedClass.merchandiseClassDescription;
                        className = className ? className : '';

                        var subClassName = subClass == null ? '' : subClass.merchandiseSubordinateClassDescription;
                        subClassName = subClassName ? subClassName : '';

                        var classNumber = scope.selectedClass == null ? '' : scope.selectedClass.merchandiseClassNumber;
                        classNumber = classNumber ? classNumber : '';

                        var subClassNumber = subClass == null ? '' : subClass.merchandiseSubordinateClassNumber;
                        subClassNumber = subClassNumber ? subClassNumber : '';

                        var jsondata = {};
                        jsondata.name = scope.selectedDept.name + delimeter + className + delimeter + subClassName;
                        jsondata.id = scope.selectedDept.id + delimeter + classNumber + delimeter + subClassNumber;
                        jsondata.catalog = 'Merch';
                        scope.data.push(jsondata);

                        var tableObject = prepareTableData(jsondata);
                        scope.tableData.push({
                            'dept': tableObject.dept,
                            'clas': tableObject.clas,
                            'subClass': tableObject.subClass,
                            'deptNum': tableObject.deptNum,
                            'clasNum': tableObject.clasNum,
                            'subClasNum': tableObject.subClasNum
                        });
                        scope.scopedata.merchTableData[scope.inclusiontype] = scope.tableData;
                    }
                }

                function prepareTableData(dataObject) {
                    var tempdata = {};
                    if (dataObject && dataObject != null) {
                        var nameArray = dataObject.name.split(delimeter);
                        var idArray = dataObject.id.split(delimeter);
                        if (nameArray.length > 0) {
                            tempdata.dept = nameArray[0] == null ? '' : nameArray[0];
                            tempdata.clas = nameArray[1] == null ? '' : nameArray[1];
                            tempdata.subClass = nameArray[2] == null ? '' : nameArray[2];
                        }
                        if (idArray.length > 0) {
                            tempdata.deptNum = idArray[0] == null ? '' : idArray[0];
                            tempdata.clasNum = idArray[1] == null ? '' : idArray[1];
                            tempdata.subClasNum = idArray[2] == null ? '' : idArray[2];
                        }
                    }
                    return tempdata;
                }

                function checkForDuplicateEntry(subClass) {
                    for (i = 0; i < scope.tableData.length; i++) {
                        if (scope.selectedDept.name == scope.tableData[i].dept) {
                            if (scope.tableData[i].clas == '') {
                                return true;
                            }
                            if (scope.selectedClass.merchandiseClassDescription == scope.tableData[i].clas) {
                                if (scope.tableData[i].subClass === '') {
                                    return true;
                                }
                                if (subClass.merchandiseSubordinateClassDescription == scope.tableData[i].subClass && subClass.merchandiseSubordinateClassNumber == scope.tableData[i].subClasNum) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }

                function deleteRow(index) {
                    var idResult = scope.prepareJsondata(scope.tableData[index]);
                    for (var j = 0; j < scope.data.length; j++) {
                        if (scope.data[j].id === idResult) {
                            scope.data.splice(j, 1);
                        }
                    }
                    scope.tableData.splice(index, 1);
                }

                function deleteAllRows() {
                    scope.data.splice(0, scope.data.length);
                    scope.tableData.splice(0, scope.tableData.length);
                    scope.validationErrors = {};
                }

                function validatePromotion() {
                    scope.validationErrors = {};
                    scope.validationErrors.skuTypeFilter = validationService.validateSkyTypeFilter(scope.source);
                }

                function showSkuTypeModal(ev) {
                    $mdDialog.show({
                        template: '<sku-type-modal source="source"></sku-type-modal>',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        scope: scope,
                        preserveScope: true
                    }).finally(function () {
                        scope.validatePromotion();
                    });
                }
            }
        };

    }
]);
