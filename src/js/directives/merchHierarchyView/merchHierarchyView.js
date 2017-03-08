//Merch Hierarchy 
app.directive("merchHierarchyView", ['merchHierarchyDataService', 'DataFactory', 'OverlayConfigFactory',

	function (merchHierarchyDataService, DataFactory, OverlayConfigFactory) {
		return {
			restrict: 'E',
			templateUrl: 'merchHierarchyView.html',
			scope: {
				data: '=',
				promoform: '=',
				isDisabled: '='
			},
			link: function (scope, $element, attrs) {
				var delimeter = ">>";

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
					function (error) {
					}
				);
				// Classes code STARTs

				scope.getClassesforSelectedDepartment = function () {

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
							function (error) {
								scope.merchDataLoading = false;
							});
					}
				}

				// getSubClassess Method - START
				scope.getSubClasses = function () {

					if (scope.selectedClass == null) {
						scope.SubClassList = [];
					}
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
							function (error) {
								scope.merchDataLoading = false;
							});
					}
				}
				// getSubClassess Method - START


				scope.deps = [];
				scope.data = $.extend(true, [], scope.data);
				scope.tableData = $.extend(true, [], scope.tableData);

				if (scope.data && scope.data.length > 0) {
					for (var i = 0; i < scope.data.length; i++) {
						if (scope.data[i].catalog === "Merch") {

							var tableObject = prepareTableData(scope.data[i]);


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

				function prepareJsondata(dataObject) {
					var dcsId = "";
					if (dataObject) {
						var dptNum = dataObject.deptNum;
						if (dptNum) { dptNum = dptNum } else { dptNum = ""; }
						var clsNum = dataObject.clasNum;
						if (clsNum) { clsNum = clsNum } else { clsNum = ""; }
						var subclsNum = dataObject.subClasNum;
						if (subclsNum) { subclsNum = subclsNum } else { subclsNum = ""; }
					}

					dcsId = dptNum + delimeter + clsNum + delimeter + subclsNum;

					return dcsId;
				}


				scope.selectedOption = [];
				scope.browseCatalogOverlayConfig = OverlayConfigFactory.getInstance();
				scope.browseCatalogOverlayConfig.mask(true);
				var emptyCheck = -1;
				scope.showData = function () {
					var tableData = []
					var jsondata = {};
					if (scope.selectedDept == null) {
						DataFactory.messageModal.message = 'No Department Selected  , Please select  Department';
						DataFactory.messageModal.title = 'Warning';
						$('#messageModal').popup();
					}

					else {

						if (scope.tableData.length === 0) {


							if (scope.selectedClass) {
								var className = scope.selectedClass.merchandiseClassDescription
							}
							else {
								var className = "";
							}

							if (scope.selectedSubClass) {
								var subClassName = scope.selectedSubClass.merchandiseSubordinateClassDescription;
							}
							else {
								var subClassName = "";
							}
							var classNumber = scope.selectedClass == null ? "" : scope.selectedClass.merchandiseClassNumber;
							var subClassNumber = scope.selectedSubClass == null ? "" : scope.selectedSubClass.merchandiseSubordinateClassNumber;

							jsondata.name = scope.selectedDept.name + delimeter + className + delimeter + subClassName;
							jsondata.id = scope.selectedDept.id + delimeter + classNumber + delimeter + subClassNumber;
							jsondata.catalog = 'Merch';

							var tableObject = prepareTableData(jsondata);

							scope.data.push(jsondata);


							scope.tableData.push({
								'dept': tableObject.dept,
								'clas': tableObject.clas,
								'subClass': tableObject.subClass,
								'deptNum': tableObject.deptNum,
								'clasNum': tableObject.clasNum,
								'subClasNum': tableObject.subClasNum
							});

							emptyCheck = 0;

						}

						else {

							if (scope.selectedClass == null) {
								scope.selectedClass = { merchandiseClassDescription: "" }
								scope.selectedClass = { merchandiseClassNumber: "" }
							}
							if (scope.selectedSubClass == null) {
								scope.selectedSubClass = { merchandiseSubordinateClassDescription: "" }
								scope.selectedSubClass = { merchandiseSubordinateClassNumber: "" }
							}
							var duplicatecheck = checkForDuplicateEntry();
							if (duplicatecheck == true) {

								DataFactory.messageModal.message = 'Duplicate Entry Please Select Another Combination:';
								DataFactory.messageModal.title = 'Warning';
								$('#messageModal').popup();
							}
							else {



								var className = scope.selectedClass == null ? "" : scope.selectedClass.merchandiseClassDescription;
								if (className) {
									className = className;
								} else {
									className = "";
								}
								var subClassName = scope.selectedSubClass == null ? "" : scope.selectedSubClass.merchandiseSubordinateClassDescription;
								if (subClassName) {
									subClassName = subClassName;
								}
								else {
									subClassName = "";
								}
								var classNumber = scope.selectedClass == null ? "" : scope.selectedClass.merchandiseClassNumber;

								if (classNumber) {
									classNumber = classNumber
								}
								else {
									classNumber = ""
								}
								var subClassNumber = scope.selectedSubClass == null ? "" : scope.selectedSubClass.merchandiseSubordinateClassNumber;

								if (subClassNumber) {
									subClassNumber = subClassNumber
								} else {
									subClassNumber = "";
								}

								jsondata.name = scope.selectedDept.name + delimeter + className + delimeter + subClassName;
								jsondata.id = scope.selectedDept.id + delimeter + classNumber + delimeter + subClassNumber;
								jsondata.catalog = 'Merch';

								var tableObject = prepareTableData(jsondata);

								scope.data.push(jsondata);

								scope.tableData.push({
									'dept': tableObject.dept,
									'clas': tableObject.clas,
									'subClass': tableObject.subClass,
									'deptNum': tableObject.deptNum,
									'clasNum': tableObject.clasNum,
									'subClasNum': tableObject.subClasNum
								});




							}
						}

					}
					scope.dept = '';
					scope.deptNum = '';
					scope.clas = '';
					scope.clasNum = '';
					scope.subClass = '';
					scope.subClasNum = '';
				}

				function prepareTableData(dataObject) {
					var tempdata = {};
					if (dataObject && dataObject != null) {

						var nameArray = dataObject.name.split(delimeter);
						var idArray = dataObject.id.split(delimeter);



						if (nameArray.length > 0) {


							tempdata.dept = nameArray[0] == null ? "" : nameArray[0];
							tempdata.clas = nameArray[1] == null ? "" : nameArray[1];
							tempdata.subClass = nameArray[2] == null ? "" : nameArray[2];
						}

						if (idArray.length > 0) {
							tempdata.deptNum = idArray[0] == null ? "" : idArray[0];
							tempdata.clasNum = idArray[1] == null ? "" : idArray[1];
							tempdata.subClasNum = idArray[2] == null ? "" : idArray[2];
						}

					}
					return tempdata;
				}


				function checkForDuplicateEntry() {
					for (i = 0; i < scope.tableData.length; i++) {
						if (scope.selectedDept.name == scope.tableData[i].dept) {
							if (scope.tableData[i].clas == "") {
								return true;
							}
							if (scope.selectedClass.merchandiseClassDescription == scope.tableData[i].clas) {
								if (scope.tableData[i].subClass === "") {
									return true;
								}
								if (scope.selectedSubClass.merchandiseSubordinateClassDescription == scope.tableData[i].subClass) {
									return true;
								}
							}

						}
					}
					return false;
				}
				scope.deleteRow = function (index) {

					var temp = scope.data[index].name + "-" + scope.data[index].id + "-" + scope.data[index].catalog;
					var idResult = prepareJsondata(scope.tableData[index]);

					for (var j = 0; j < scope.data.length; j++) {
						if (scope.data[j].id === idResult) {
							scope.data.splice(j, 1);
						}
					}

					scope.tableData.splice(index, 1);

				}

				function deleteDataArray() {

				}


			}
		};

	}]);


