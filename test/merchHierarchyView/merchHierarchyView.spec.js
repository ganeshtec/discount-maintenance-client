describe('Unit testing merchHierarchyView directive', function () {
    var $compile,
        $rootScope,
        $scope,
        $q,
        merchHierarchyDataService;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$q_, _$rootScope_, _$httpBackend_, _merchHierarchyDataService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        merchHierarchyDataService = _merchHierarchyDataService_;
        $scope = $rootScope.$new();
        spyOn(merchHierarchyDataService, 'getAllDepartments').and.callFake(function () {
            var deferredResult = $q.defer();
            deferredResult.resolve({"merchDepartments":[{"departmentNumber":1,"departmentName":"FLEX TO HTML"},{"departmentNumber":12,"departmentName":"DEPART"},{"departmentNumber":13,"departmentName":"BUTTON TYPE BUTTON"}]});
            return deferredResult.promise;
        });
        spyOn(merchHierarchyDataService, 'getAllClasses').and.callFake(function (arguments) {
            var deferredResultClasses = $q.defer();
            deferredResultClasses.resolve({"merchClasses":[{"merchandiseClassNumber":1,"merchandiseClassDescription":"FLEX TO HTML"}]});
            //console.log('getAllClasses arguments 1', arguments, deferredResultClasses.promise)
            return deferredResultClasses.promise;
        });
        spyOn(merchHierarchyDataService, 'getSubClasses').and.callFake(function (arguments) {
            var deferredResultSubClasses = $q.defer();
            deferredResultSubClasses.resolve({"merchSubClasses":[{"merchandiseSubordinateClassNumber":1,"merchandiseSubordinateClassDescription":"FLEX TEST"}]});
            //console.log('getSubClasses arguments 1', arguments, deferredResultSubClasses.promise)
            return deferredResultSubClasses.promise;
        });
        _$httpBackend_.when('GET', '/labels/leadTime')
        .respond(200, 3);
    }));

    describe("verify departmentDetails, classes, subclasses ", function () {
        beforeEach(function () {
            $scope.data = [];
            $scope.tableData = [];
            $scope.preview = false;
            $scope.isDisabled = false;
            $scope.item = { "purchaseoption": "category"};
        });
        it('verify department', function () {
            $scope.viewProp = { displayOMSIdExclusion: false, displayItemsSku: true }
            var element = $compile('<merch-hierarchy-view data="data"  preview="preview" source="item" is-disabled="isDisabled" promoform="promoform" view-prop="viewProp" promo-status="data.status" ng-show="item.purchaseoption == \'category\' && viewProp.displayItemsSku"></merch-hierarchy-view>')($scope);
            $scope.$digest();

            this.$isolateScope = element.isolateScope(); 

            expect(this.$isolateScope.departmentDetails).toBeDefined();
            expect(this.$isolateScope.departmentDetails.length).toBe(3);
            
            this.$isolateScope.selectedDept = this.$isolateScope.departmentDetails[0];
            this.$isolateScope.getClassesforSelectedDepartment();
            expect(this.$isolateScope.classList).toBeDefined();
            
            this.$isolateScope.selectedClass = this.$isolateScope.classList[0];
            this.$isolateScope.getSubClasses();
            expect(this.$isolateScope.SubClassList).toBeDefined();

            expect(this.$isolateScope.prepareJsondata({"deptNum":'1',"clasNum":'1',"subClasNum":'1'})).toBe('1>>1>>1');

            this.$isolateScope.deleteAllRows();
            expect(this.$isolateScope.tableData.length).toBe(0);
            expect(this.$isolateScope.data.length).toBe(0);
        });
    });
});
