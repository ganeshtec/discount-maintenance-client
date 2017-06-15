describe('Unit testing itemInclusion.component.spec.js', function () {
    var $componentController,
        $compile,
        $rootScope,
        $scope,
        element,
        itemsDataService,
        $q;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$componentController_, _$rootScope_, _itemsDataService_, _$q_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $q = _$q_;
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        // $scope = $rootScope.$new();
        itemsDataService = _itemsDataService_;

        ctrl = $componentController('itemInclusion', null, {
            data: {}

        });




    }));

    it('Checks if item-inclusion component is rendering item skus', function () {
        var itemData = ['1000317883', '100049'];
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
        var element = $compile("<item-inclusion data='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain("Sku");
        expect(element.html()).toContain("Description");
        expect(element.html()).toContain("SMOOTH FLUSH SOLID CORE PRIMED CHROM");
        expect(element.html()).toContain('16"X16" MONTAGNA BELLUNO-15.5SF CA');

    });

    it('Checks if item-inclusion component is rendering item oms ids', function () {
        var itemData = ['1000317883', '100049'];
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
        var element = $compile("<item-inclusion data='itemData' itemtype='itemtype'></item-inclusion>")($rootScope);
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
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
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
        expect(ctrl.validSkuInfo.length).toEqual(1);
        ctrl.addSku(sku2);
        expect(ctrl.validSkuInfo.length).toEqual(2);
    });

    it('Verify addSku adds duplicate skuNumber to existingID', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
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
        expect(ctrl.validSkuInfo.length).toEqual(1);
        expect(ctrl.existingID).toEqual("100091, ");
    });

    it('Verify addItem adds item to validOmsInfo', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
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
        expect(ctrl.validOmsInfo.length).toEqual(1);
        ctrl.addItem(sku2);
        expect(ctrl.validOmsInfo.length).toEqual(2);
    });

    it('Verify addItem adds duplicate omsId to existingID', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
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
        expect(ctrl.validOmsInfo.length).toEqual(1);
        expect(ctrl.existingID).toEqual("12345, ");
    });

    it('Verify setData creates an arrayOfOmsIDs and sets it to data', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
        ctrl.$onInit();
        ctrl.validOmsInfo = [{
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
        expect(ctrl.data.length).toEqual(2);
        expect(ctrl.data[0]).toEqual(12345);
        expect(ctrl.data[1]).toEqual(79879);
    });

    it('Verify setSkuData creates an arrayOfSkus and sets it to data', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
        ctrl.$onInit();
        ctrl.validSkuInfo = [{
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
        expect(ctrl.data.length).toEqual(2);
        expect(ctrl.data[0]).toEqual(100091);
        expect(ctrl.data[1]).toEqual(100049);
    });

    it('setItemData should  update the model with valid omsInfo', function () {
        ctrl = $componentController('itemInclusion', null, {
            data: []
        });
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
        expect(ctrl.data.length).toEqual(2);
        expect(ctrl.validOmsInfo.length).toEqual(2);
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
            data: [999999999,888888888]
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
        expect(ctrl.data.length).toEqual(3);
        expect(ctrl.data[0]).toEqual(999999999)
        expect(ctrl.data[1]).toEqual(888888888)
        expect(ctrl.data[2]).toEqual(77777777)
        expect(ctrl.validOmsInfo.length).toEqual(3);
    });




    // // test conditions for item skus

    // // test condition validate the place holder for item sku search.

    //   it('Checks if sku item placeholder works', function() {


    //     // Contain a piece of HTML containing the Directive  
    //     var element = $compile("<item-inclusion></item-inclusion>")($rootScope);
    //     $rootScope.$digest();


    //     expect(element.html()).toContain("Search and Add Item Sku Number");

    //   });


    // // test conditions for item skus search functionality is defined

    //   it('Checks if sku item search functionality defined', function() {

    //       var validSkuInfo = [];

    //     // Contain a piece of HTML containing the Directive  
    //         var element = $compile("<item-inclusion data='validSkuInfo'> </item-inclusion>")($rootScope);
    //         $rootScope.$digest();
    //         this.$isolateScope = element.isolateScope();
    //         spyOn(this.$isolateScope, "search").and.callThrough();

    //         this.$isolateScope.search('1234567');

    //         //expect(this.$isolateScope.search).toBeDefined();
    //         expect(this.$isolateScope.search).toHaveBeenCalled();

    //         expect(this.$isolateScope.isSkuSearch).not.toBe(undefined);

    //   });



});