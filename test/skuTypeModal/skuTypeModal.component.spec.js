describe('skuTypeModal', function () {

    var $componentController;
    var $q;
    var skuTypesDataService;
    var scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_,_skuTypesDataService_,_$q_,_$rootScope_, _loginService_) {
    $componentController = _$componentController_;
    skuTypesDataService = _skuTypesDataService_;
    loginService = _loginService_;
    $q = _$q_;
    scope =_$rootScope_;
    ctrl = $componentController('skuTypeModal',null, {
        source: {},
        promoStatus: 20
    });
    spyOn(skuTypesDataService, 'fetchSkuTypes').and.callFake(function () {
        deferredResult =$q.defer();
        deferredResult.resolve([{"skuTypeCode": "N","description": "Normal"},{"skuTypeCode": "S","description": "Special"}]);
        return deferredResult.promise;
    })

    spyOn(loginService, 'intercept').and.callFake(function () {
    })
  }));


    it('Test SKU Type modal component rendering', inject(function (_$compile_) {
        scope.source={};
        var element = _$compile_("<sku-type-modal source='source'></sku-type-modal>")(scope);
        scope.$digest();
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain("Filter SKU Types");
        expect(element.html()).toContain("N - Normal");
    }));

    it('Validate no SKU Types are selected on creating a new promotion', function () {
        ctrl.source.exclusions={initializeSkuTypeExclusions: true};
        ctrl.promoStatus= 20;
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.skuSelection['N']).toBe(false);
        expect(ctrl.skuSelection['S']).toBe(false);
        expect(ctrl.selectionMade).toBe(false);
    });

    it('All SKU Types are selected on editing an existing promotion without any SKU Type Exclusions', function () {
        ctrl.source.exclusions={};
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.skuSelection['N']).toBe(true);
        expect(ctrl.skuSelection['S']).toBe(true);
        expect(ctrl.selectionMade).toBe(true);
    });

    it('SKU Types that were previsously selected should be checked on editing', function () {
        ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'S', opeartor: '=='}]};
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.skuSelection['N']).toBe(true);
        expect(ctrl.skuSelection['S']).toBe(false);
        expect(ctrl.selectionMade).toBe(true);
    });

    it('Apply should add attributes not selected to exclusions', function () {
        ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'N', opeartor: '=='}]};
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        ctrl.skuSelection['N']=true;
        ctrl.skuSelection['S']=false;
        ctrl.applySkuTypeSelection();
        expect(ctrl.source.exclusions.attrs.length).toBe(1);
        expect(ctrl.source.exclusions.attrs[0].value).toEqual('S');
        expect(ctrl.source.exclusions.attrs[0].id).toEqual('bcdfe1a4-626a-4042-9a2e-5298f9b952a8');
         expect(ctrl.source.exclusions.attrs[0].operator).toEqual('==');
         expect(ctrl.source.exclusions.attrs[0].name).toEqual('SKU Type');
    });

    it('Apply should be disabled if no selection is made', function () {
        ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'N', opeartor: '=='},{id: '1234', name: 'SKU Type', value: 'S', opeartor: '=='}]};//Contains
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.selectionMade).toBe(false);
    });

    it('Apply should be enabled if any selection is made', function () {
        ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'N', opeartor: '=='}]};//Contains
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.selectionMade).toBe(true);
    });

    it('Close modal should leave excluded attributes unchanged', function () {
        ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'N', opeartor: '=='}]};
        ctrl.promoStatus= 70;
        ctrl.$onInit();
        scope.$digest();
        ctrl.skuSelection['N']=true;
        ctrl.skuSelection['S']=false;
        ctrl.closeSkuTypeModal();
        expect(ctrl.source.exclusions.attrs.length).toBe(1);
        expect(ctrl.source.exclusions.attrs[0].value).toEqual('N');
    });
});
