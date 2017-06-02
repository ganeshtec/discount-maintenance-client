describe('promoSkuTypeModal', function () {

    var $componentController;
    var $q;
    var skuTypesDataService;
    var scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function (_$componentController_, _$q_,_skuTypesDataService_, _$rootScope_) {
        $componentController = _$componentController_;
        $q = _$q_;
        skuTypesDataService = _skuTypesDataService_;
        scope = _$rootScope_;
        ctrl = $componentController('promoSkuTypeModal', null, {
        data: {}

        });

        spyOn(skuTypesDataService, 'fetchSkuTypes').and.callFake(function () {
        deferredResult =$q.defer();
        deferredResult.resolve([
                                {"skuTypeCode": "N","description": "Normal"},
                                {"skuTypeCode": "S","description": "Special"}
                             ]);
        return deferredResult.promise;
    })

    }));

    //  fit('Test SKU Type modal component rendering', inject(function (_$compile_) {
    //     ctrl.data={  validSkuInfo: [
    //             {
    //             }
    //         ],
    //         inValidSkuInfo: [{
    //         }
    //         ],
    //         skuCountList: [
    //             {
    //             }
    //         ],};
       
    //     var element = _$compile_("<promo-sku-type-modal data='modaldata'></promo-sku-type-modal>")(scope);
    //     scope.$digest();
    //     expect(element.html()).toContain("Filter SKU Types");
    // }));


    fit('Check SkuTypeCount is available for valid Skus Input', function () {
      //  skuTypes
        ctrl.data = { 
            validSkuInfo: [
                {
                    omsId: null,
                    prodName: null,
                    skuDescription: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                    skuNumber: 1000317883,
                    skuTypeCode: 'S'
                },
                {
                    omsId: null,
                    prodName: null,
                    skuDescription: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                    skuNumber: 100049,
                    skuTypeCode: 'N'
                },
            ],
            inValidSkuInfo: [{
            }
            ],
            skuCountList: [
                {
                }
            ],
        }
        ctrl.$onInit();
        scope.$digest();
       // expect(ctrl.skuTypes[0].skuCount).toEqual(1);  
        expect(ctrl.deferredResult[0].skuCount).toEqual(1);  
       
        // expect(ctrl.skuSelection['S']).toBe(true);       
    });

   

    it('Apply should add attributes not selected to exclusions', function () {
        // ctrl.source.exclusions={ attrs: [ {id: '1234', name: 'SKU Type', value: 'N', opeartor: '=='}]};
        // ctrl.promoStatus= 70;
        // ctrl.$onInit();
        // scope.$digest();
        // ctrl.skuSelection['N']=true;
        // ctrl.skuSelection['S']=false;
        // ctrl.applySkuTypeSelection();
        // expect(ctrl.source.exclusions.attrs.length).toBe(1); 
        // expect(ctrl.source.exclusions.attrs[0].value).toEqual('S'); 
        // expect(ctrl.source.exclusions.attrs[0].id).toEqual('bcdfe1a4-626a-4042-9a2e-5298f9b952a8');
        //  expect(ctrl.source.exclusions.attrs[0].operator).toEqual('==');  
        //  expect(ctrl.source.exclusions.attrs[0].name).toEqual('SKU Type');  
    });

});
