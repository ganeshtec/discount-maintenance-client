describe('Unit testing purchaseConditionRewards directive', function () {
    var $compile,
        $rootScope,
        $scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        _$httpBackend_.when('GET', '/customersegment/segments')
            .respond(200, { segments: [] });
        _$httpBackend_.when('GET', '/skutypes/')
            .respond(200, []);
        _$httpBackend_.when('GET', '/merchHierarchy/departments')
            .respond(200, []);
        _$httpBackend_.when('GET', '/labels/leadTime')
            .respond(200, 3);
    }));

    describe("Show/Hide options based on flags", function () {
        beforeEach(function () {
            $scope.data = { purchaseConds: { sources: [{ purchaseoption: 'category' }] } };
            $scope.promoform = {};
            $scope.preview = false;
            $scope.isDisabled = false;
        });
        it('verify Items/SKU radio button displays only if displayItemsSku view property is set to true', function () {
            $scope.viewProp = { displayOMSIdExclusion: false, displayItemsSku: true }
            var element = $compile("<purchase-condition-rewards data='data' promoform='promoform' preview='preview' view-prop='viewProp'></purchase-condition-rewards>")($scope);
            $scope.$digest();
            expect(element.find("div[id='itemsoms_div_0']").attr('aria-hidden')).toBe('true');
            expect(element.find("div[id='itemssku_div_0']").attr('aria-hidden')).toBe('false');
        });

        it("Show/Hide Filter SKUTypes based on viewProperty displayFilterSkuTypes value", function () {
            $scope.viewProp = { displayFilterSkuTypes: false }
            $scope.data = { purchaseConds: { sources: [{ purchaseoption: 'category' }] } };
            $scope.promoform = {};
            $scope.preview = false;
            $scope.isDisabled = false;
            var element = $compile("<purchase-condition-rewards data='data' promoform='promoform' preview='preview' view-prop='viewProp'></purchase-condition-rewards>")($scope);
            $scope.$digest();
            expect(element.find("div[class*='filter_sku_types_link']").attr('aria-hidden')).toBe('true');
        })

         
    });

        it('updatePrintLabel should set printLabel to false if item/sku selected', function () {

            $scope.viewProp = { displayFilterSkuTypes: true }
            $scope.data = { purchaseConds: { sources: [{ purchaseoption: 'category' }] } };
            $scope.promoform = {};
            $scope.preview = false;
            $scope.isDisabled = false;
            var element = $compile("<purchase-condition-rewards data='data' promoform='promoform' preview='preview' view-prop='viewProp'></purchase-condition-rewards>")($scope);
            $scope.$digest();
            this.$isolateScope = element.isolateScope();   

            this.$isolateScope.updatePrintLabel();
            expect(this.$isolateScope.data.printLabel).toBe(false);
         });

          it('updatePrintLabel should set printLabel to false if category selected', function () {

            $scope.viewProp = { displayFilterSkuTypes: true }
            $scope.data = { purchaseConds: { sources: [{ purchaseoption: 'category' }] } };
        
            $scope.promoform = {};
            $scope.preview = false;
            $scope.isDisabled = false;
            var element = $compile("<purchase-condition-rewards data='data' promoform='promoform' preview='preview' view-prop='viewProp'></purchase-condition-rewards>")($scope);
            $scope.$digest();
            this.$isolateScope = element.isolateScope();   

            this.$isolateScope.updatePrintLabel();
            expect(this.$isolateScope.data.printLabel).toBe(false);
            expect(this.$isolateScope.data.labelText).toBe('');
         });




});
