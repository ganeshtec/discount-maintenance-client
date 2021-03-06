describe('Unit testing itemInclusion.component.spec.js', function () {
    var $componentController,
        $compile,
        $rootScope,
        $scope,
        element,
        itemsDataService,
        skuTypesDataService,
        $q;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$componentController_, _$rootScope_, _itemsDataService_, _$q_,_skuTypesDataService_, _loginService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $q = _$q_;
        loginService = _loginService_;
        $componentController = _$componentController_;
        skuTypesDataService=_skuTypesDataService_;
        $rootScope = _$rootScope_;
        // $scope = $rootScope.$new();
        itemsDataService = _itemsDataService_;
        spyOn(skuTypesDataService,'fetchSkuTypes').and.callFake(function () {
            deferredResult =$q.defer();
            deferredResult.resolve([{"skuTypeCode": "N","description": "Normal"},{"skuTypeCode": "S","description": "Special"}]);
            return deferredResult.promise;
        });

        spyOn(loginService, 'intercept').and.callFake(function () {
        })

        ctrl = $componentController('itemInclusion', null, {
            partnumbersparent: { partnumbers: []}
        });




    }));

    it('Checks if item-inclusion component is rendering item skus', function () {
        var itemData = {partnumbers:['1000317883', '100049']};
        spyOn(itemsDataService, 'getSkuIDs').and.returnValue(itemData);
        spyOn(itemsDataService, 'getSkuIdCodes').and.callFake(function () {
            deferredResult = $q.defer();
            deferredResult.resolve({
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
            });
            return deferredResult.promise;
        })
        // Compile a piece of HTML containing the directive
        $rootScope.itemData = itemData;
        $rootScope.itemtype = 'SKU';
        var element = $compile("<item-inclusion partnumbersparent='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain("SKU");
        expect(element.html()).toContain("SKU Type");
        expect(element.html()).toContain("Description");
        expect(element.html()).toContain("SMOOTH FLUSH SOLID CORE PRIMED CHROM");
        expect(element.html()).toContain('16"X16" MONTAGNA BELLUNO-15.5SF CA');

    });

    it('Checks if item-inclusion component is rendering item oms ids', function () {
        var itemData = {partnumbers:['1000317883', '100049']};
        spyOn(itemsDataService, 'getOmsIDs').and.returnValue(itemData);
        spyOn(itemsDataService, 'getOmsIdCodes').and.callFake(function () {
            deferredResult = $q.defer();
            deferredResult.resolve({
                validOmsInfo: [
                    {
                        omsId: 999999999,
                        prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                        skuNumber: 1000317883,
                        skuTypeCode: 'S'
                    },
                    {
                        omsId: 888888888,
                        prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                        skuNumber: 100049,
                        skuTypeCode: 'N'
                    },
                ],
                inValidOmsInfo: [{
                }
                ]
            });
            return deferredResult.promise;
        })
        // Compile a piece of HTML containing the directive
        $rootScope.itemData = itemData;
        $rootScope.itemtype = 'OMS';
        var element = $compile("<item-inclusion partnumbersparent='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain("Please enter a valid 9 digit OMS ID");
        expect(element.html()).toContain("OMS ID");
        expect(element.html()).toContain("Sku");
        expect(element.html()).toContain("Description");
        expect(element.html()).toContain('999999999');
        expect(element.html()).toContain('1000317883');
        expect(element.html()).toContain("SMOOTH FLUSH SOLID CORE PRIMED CHROM");

    });

    it('Verify addSku adds sku to validSkuInfo', function () {
        ctrl.$onInit();
        var sku = {
            omsId: null,
            prodName: null,
            skuDescription: "18/2 100' THERMOSTAT WIRES",
            skuNumber: 100091,
            skuTypeCode: "D"
        };
        var sku2 = {
            omsId: null,
            prodName: null,
            skuDescription: "18/2 100' THERMOSTAT WIRES",
            skuNumber: 100049,
            skuTypeCode: "D"
        };
        ctrl.addSku(sku);
        expect(ctrl.partnumbersparent.validSkuInfo.length).toEqual(1);
        ctrl.addSku(sku2);
        expect(ctrl.partnumbersparent.validSkuInfo.length).toEqual(2);
    });

    it('Verify addSku adds duplicate skuNumber to existingID', function () {
        
        ctrl.$onInit();
        var sku = {
            omsId: null,
            prodName: null,
            skuDescription: "18/2 100' THERMOSTAT WIRES",
            skuNumber: 100091,
            skuTypeCode: "D"
        };
        ctrl.addSku(sku);
        ctrl.addSku(sku);
        expect(ctrl.partnumbersparent.validSkuInfo.length).toEqual(1);
        expect(ctrl.existingID).toEqual("100091, ");
    });

    it("Verify skuTypeDescriptionLookup table is properly initalized", function(){
        ctrl = $componentController('itemInclusion', null, {
            partnumbersparent: {partnumbers:[]}
        });
        ctrl.$onInit();
        $rootScope.$digest();
        expect(ctrl.skuTypeDescriptionLookup['N']).toEqual('Normal');
        expect(ctrl.skuTypeDescriptionLookup['S']).toEqual('Special');
    })

    it('Verify addItem adds item to validOmsInfo', function () {
        ctrl.$onInit();
        var sku = {
            omsId: 12345,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100091,
            skuTypeCode: "D"
        };
        var sku2 = {
            omsId: 79879,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100049,
            skuTypeCode: "N"
        };
        ctrl.addItem(sku);
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(1);
        ctrl.addItem(sku2);
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(2);
    });

    it('Verify addItem adds duplicate omsId to existingID', function () {
        
        ctrl.$onInit();
        var sku = {
            omsId: 12345,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100091,
            skuTypeCode: "D"
        };
        ctrl.addItem(sku);
        ctrl.addItem(sku);
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(1);
        expect(ctrl.existingID).toEqual("12345, ");
    });

    it('Verify setData creates an arrayOfOmsIDs and sets it to data', function () {
        
        ctrl.$onInit();
        ctrl.partnumbersparent.validOmsInfo = [{
            omsId: 12345,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100091,
            skuTypeCode: "D"
        },
        {
            omsId: 79879,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100049,
            skuTypeCode: "N"
        }];
        ctrl.setData()
        expect(ctrl.partnumbersparent.partnumbers.length).toEqual(2);
        expect(ctrl.partnumbersparent.partnumbers[0]).toEqual(12345);
        expect(ctrl.partnumbersparent.partnumbers[1]).toEqual(79879);
    });

    it('Verify setSkuData creates an arrayOfSkus and sets it to data', function () {
        ctrl.$onInit();
        ctrl.partnumbersparent.validSkuInfo = [{
            omsId: 12345,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100091,
            skuTypeCode: "D"
        },
        {
            omsId: 79879,
            prodName: "18/2 100' THERMOSTAT WIRES",
            skuDescription: null,
            skuNumber: 100049,
            skuTypeCode: "N"
        }];
        ctrl.setSkuData()
        expect(ctrl.partnumbersparent.partnumbers.length).toEqual(2);
        expect(ctrl.partnumbersparent.partnumbers[0]).toEqual(100091);
        expect(ctrl.partnumbersparent.partnumbers[1]).toEqual(100049);
    });

    it('setItemData should  update the model with valid omsInfo', function () {
        // ctrl = $componentController('itemInclusion', null, {
        //     data: []
        // });
        ctrl.$onInit();

        var itemData = {
            validOmsInfo: [
                {
                    omsId: 999999999,
                    prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                    skuNumber: 1000317883,
                    skuTypeCode: 'S'
                },
                {
                    omsId: 888888888,
                    prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                    skuNumber: 100049,
                    skuTypeCode: 'N'
                },
            ],
            inValidOmsInfo: [
                {

                }
            ]
        };
        ctrl.itemSearch = "999999999 , 888888888"
        ctrl.setItemData(itemData, true)
        expect(ctrl.partnumbersparent.partnumbers.length).toEqual(2);
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(2);
    });

    it('setItemData should show a warning message if any of the items are already present', function () {
        spyOn(itemsDataService, 'getOmsIDs').and.returnValue(itemData);
        spyOn(itemsDataService, 'getOmsIdCodes').and.callFake(function () {
            deferredResult = $q.defer();
            deferredResult.resolve({
                validOmsInfo: [
                    {
                        omsId: 999999999,
                        prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                        skuNumber: 1000317883,
                        skuTypeCode: 'S'
                    },
                    {
                        omsId: 888888888,
                        prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                        skuNumber: 100049,
                        skuTypeCode: 'N'
                    },
                ],
                inValidOmsInfo: [{
                }
                ]
            });
            return deferredResult.promise;
        });
        ctrl = $componentController('itemInclusion', null, {
            partnumbersparent: {partnumbers: [999999999,888888888]}
        });
        
        ctrl.$onInit();
        $rootScope.$digest();
        var itemData = {
            validOmsInfo: [
                {
                    omsId: 999999999,
                    prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                    skuNumber: 1000317883,
                    skuTypeCode: 'S'
                },
                {
                    omsId: 888888888,
                    prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                    skuNumber: 100049,
                    skuTypeCode: 'N'
                },
                {
                    omsId: 77777777,
                    prodName: 'TEst1',
                    skuNumber: 100047,
                    skuTypeCode: 'N'
                },
            ],
            inValidOmsInfo: [
                {

                }
            ]
        };
        spyOn(ctrl, 'showMessageModal');
        ctrl.setItemData(itemData, true);
        expect(ctrl.showMessageModal).toHaveBeenCalledTimes(1);
        expect(ctrl.partnumbersparent.partnumbers.length).toEqual(3);
        expect(ctrl.partnumbersparent.partnumbers[0]).toEqual(888888888)
        expect(ctrl.partnumbersparent.partnumbers[1]).toEqual(999999999)
        expect(ctrl.partnumbersparent.partnumbers[2]).toEqual(77777777)
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(3);
    });

    it('verify that isSkuSearch is initalized to true if the purchaseoption passed is itemsku',function(){
        ctrl.purchaseoption= 'itemsku'
        // });
        ctrl.$onInit();
        expect(ctrl.isSkuSearch).toBe(true);
    });

    it('verify that isSkuSearch is initalized to false if the purchaseoption passed is itemoms',function(){
        ctrl.purchaseoption= 'itemoms';
        ctrl.$onInit();
        expect(ctrl.isSkuSearch).toBe(false);
    });

    it('verify that isSkuSearch is changes to true if the purchaseoption itemsku is selected', function(){
        ctrl.purchaseoption= 'itemoms';
        ctrl.$onInit();
        expect(ctrl.isSkuSearch).toBe(false);
        var changes={};
        changes.purchaseoption={};
        changes.purchaseoption.previousValue="itemoms";
        changes.purchaseoption.currentValue="itemsku";
        ctrl.$onChanges(changes);
        expect(ctrl.isSkuSearch).toBe(true);
    });

    it('setItemData should condense multiple omsIds with multiple skus into one', function () {
        // ctrl = $componentController('itemInclusion', null, {
        //     data: []
        // });
        ctrl.$onInit();

        var itemData = {
            validOmsInfo: [
                {
                    omsId: 999999999,
                    prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                    skuNumber: 1000317883,
                    skuTypeCode: 'S'
                },
                {
                    omsId: 999999999,
                    prodName: 'SMOOTH FLUSH SOLID CORE PRIMED CHROM',
                    skuNumber: 1000317884,
                    skuTypeCode: 'S'
                },
                {
                    omsId: 888888888,
                    prodName: '16"X16" MONTAGNA BELLUNO-15.5SF CA',
                    skuNumber: 100049,
                    skuTypeCode: 'N'
                },
            ],
            inValidOmsInfo: [
                {

                }
            ]
        };
        ctrl.itemSearch = "999999999 , 888888888"
        ctrl.setItemData(itemData, true)
        expect(ctrl.partnumbersparent.partnumbers.length).toEqual(2);
        expect(ctrl.partnumbersparent.validOmsInfo.length).toEqual(2);
        expect(ctrl.partnumbersparent.validOmsInfo[1].skuNumber).toEqual("1000317883 1000317884")
    });



});
