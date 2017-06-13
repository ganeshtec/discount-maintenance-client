describe('promoSkuTypeModal', function () {

    var $componentController;
    var $q;
    var skuTypesDataService;
    var scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function (_$componentController_, _$q_, _skuTypesDataService_, _$rootScope_) {
        $componentController = _$componentController_;
        $q = _$q_;
        skuTypesDataService = _skuTypesDataService_;
        scope = _$rootScope_;
        ctrl = $componentController('promoSkuTypeModal', null, {
            data: {}

        });

        spyOn(skuTypesDataService, 'fetchSkuTypes').and.callFake(function () {
            deferredResult = $q.defer();
            deferredResult.resolve([
                { "skuTypeCode": "N", "description": "Normal" },
                { "skuTypeCode": "S", "description": "Special" },
                { "skuTypeCode": "D", "description": "Does not Exist" }
            ]);
            return deferredResult.promise;

        })

    }));

    it('Test Promo SKU Type modal component rendering', inject(function (_$compile_) {
        scope.skuIdValidationResponse = {
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
                        "skuTypeCode": "S",
                        "skuCount": 1

                    },
                    {
                        "skuTypeCode": "N",
                        "skuCount": 1

                    }
                ]
        };
        var element = _$compile_("<promo-sku-type-modal data='data'></promo-sku-type-modal>")(scope);
        scope.$digest();
        expect(element.html()).toContain("Filter SKU Types");
    }));

    it('Check SkuTypeCount is available for valid Skus Input', function () {
        //  skuTypes
        ctrl.skuIdValidationResponse = {
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
                        "skuTypeCode": "S",
                        "skuCount": 1

                    },
                    {
                        "skuTypeCode": "N",
                        "skuCount": 1

                    }
                ]
        }
        ctrl.$onInit();
        scope.$digest();
        expect(ctrl.skuTypes.length).toEqual(3);


        expect(ctrl.skuTypes[0].skuTypeCode).toEqual('N');
        expect(ctrl.skuTypes[0].description).toEqual('Normal');

        
        expect(ctrl.skuTypes[1].skuTypeCode).toEqual('S');
        expect(ctrl.skuTypes[1].description).toEqual('Special');
        expect(ctrl.skuSelectionMap['S'].count).toEqual(1);
        expect(ctrl.skuSelectionMap['S'].selected).toEqual(true);
        expect(ctrl.skuSelectionMap['N'].count).toEqual(1);
        expect(ctrl.skuSelectionMap['N'].selected).toEqual(true);
        expect(ctrl.skuSelectionMap['D'].count).toEqual(0);
        expect(ctrl.skuSelectionMap['D'].selected).toEqual(false);
    });

});
