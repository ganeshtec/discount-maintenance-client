describe('Unit testing qualifiers component', function () {
    var $componentController;

    beforeEach(module('app'));

    beforeEach(function () {
        module("app", function ($provide) {
            $provide.constant("MaxCouponGenerationLimit", 300000);
        });
    });

    beforeEach(inject(function (_$componentController_) {

        $componentController = _$componentController_;
        ctrl = $componentController('qualifiers', null, {
            data: {

                reward: {},
                promoCdSpec: {
                    systemGen: {}
                },
                purchaseConds: {
                    program: {

                    }
                },
                segment: {}
            },
        }
        );
    }));



    it('No Segment Selected', function () {
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
    });

    it('Program Segment Selected', function () {
        ctrl.data.segment = { id: -1, "segmentName": "PRO XTRA PAINT REWARDS-Bronze", "progId": 2, "tierId": 8 };
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(2);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(8);
    });

    it('Program Segment Selected and ProPaint Set To NULL', function () {
        ctrl.data.segment = {  id: -1,"segmentName": "PRO XTRA PAINT REWARDS-Bronze", "progId": 2, "tierId": 8 };
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.program.proPaint).toBeNull();
    });

    it('Program Segment Selected and ProPaint Set To True', function () {
        ctrl.data.segment = {  id: -1,"segmentName": "PRO XTRA PAINT REWARDS-Bronze", "progId": 8, "tierId": 8 };
        ctrl.programIdForProMonthly = "8";
        expect(ctrl.showProPaintOptions()).toBe(true);

    });

    it('Customer Segment Selected', function () {
        ctrl.data.segment = { "id": 13550, "segmentName": "Segment 919" };
        ctrl.data.checkRapidPass = false;
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(13550);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
        expect(ctrl.data.disableRapidPass).toBe(false);
    });

    it('Rapid Pass not selected', function () {
        ctrl.data.checkRapidPass = false;
        ctrl.selectRapidPass();

        expect(ctrl.data.promoCdRqrd).toBe(false);
        expect(ctrl.data.promoCdSpec).toBe(undefined);
    });

    it('Rapid Pass selected', function () {
        ctrl.data.checkRapidPass = true;
        ctrl.data.segment.id = 12345;
        ctrl.selectRapidPass();

        expect(ctrl.data.promoCdSpec.type).toBe('Private');
        expect(ctrl.data.promoCdSpec.genType).toBe('Dynamically Generated');
        expect(ctrl.data.promoCdSpec.cdLength).toBe('12');
        expect(ctrl.data.rapidPassCouponLimit).toBe(undefined);

        expect(ctrl.data.promoCdSpec.systemGen.uniqueCdCnt).toBe('');
        expect(ctrl.data.promoCdSpec.systemGen.cdPrefix).toBe('010012345');
        expect(ctrl.data.promoCdSpec.systemGen.cdSuffix).toBe('');
        expect(ctrl.data.promoCdRqrd).toBe(true);
    });

    it('All Pro segment is selected and Rapid Pass is unchecked then Rapid Pass disabled', function () {
        ctrl.data.segment = { "id": -1, "segmentName": "Target all Pro Customers" };
        ctrl.data.purchaseConds.allProDiscount = false;
        ctrl.data.checkRapidPass = false;
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.allProDiscount).toBe(true);
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
        expect(ctrl.data.disableRapidPass).toBe(true);
    });

    it('All Pro segment is selected when Rapid Pass checked then disable and clear Rapid Pass', function () {
        ctrl.data.segment = { "id": -1, "segmentName": "Target all Pro Customers" };
        ctrl.data.purchaseConds.allProDiscount = false;
        ctrl.data.checkRapidPass = true;
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.allProDiscount).toBe(true);
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
        expect(ctrl.data.checkRapidPass).toBe(false);
        expect(ctrl.data.promoCdSpec).toEqual({});
        expect(ctrl.data.promoCdRqrd).toBe(false);
        expect(ctrl.data.disableRapidPass).toBe(true);
    });

    it('initialize for Edit mode of Active promotion', function () {
        ctrl.data.promoCdSpec.genType = 'Dynamically Generated';
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 30;
        ctrl.data.status = 61;

        ctrl.initialize();

        expect(ctrl.data.checkRapidPass).toBe(true);
        expect(ctrl.data.disableRapidPass).toBe(true);

    });

    it('initialize for Edit mode of Non Active promotion', function () {
        ctrl.data.promoCdSpec.genType = 'Dynamically Generated';
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 30;
        ctrl.data.status = 57;

        ctrl.initialize();

        expect(ctrl.data.checkRapidPass).toBe(true);
        expect(ctrl.data.disableRapidPass).toBe(false);

    });

    it('initialize for new promotion', function () {
        ctrl.data.promoCdSpec.genType = '';
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = '';
        ctrl.data.checkRapidPass = false;
        ctrl.initialize();
        expect(ctrl.data.checkRapidPass).toBe(false);

    });

    it('check rapid pass coupon limit exceeds 300000', function () {
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 300001;
        ctrl.MaxCouponGenerationLimit = 300000;

        expect(ctrl.checkRapidPassCouponLimit()).toBe(true);
    });

    it('check rapid pass coupon limit does not exceeds 300000', function () {
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 3000;
        ctrl.MaxCouponGenerationLimit = 300000;

        expect(ctrl.checkRapidPassCouponLimit()).toBe(false);
    });

    // LOCATIONS START

    //Verify item is added to item table if data service response is valid
    //Verify if negative number is added to Store list error is thrown
    //Verify that when Market and Store service does not return correct status code, application does not crash
    //Verify that when store service returns 3 stores, they are passed on to the html
    //Verify functionality of markets -> store list translation service

    //Tests to make sure space, comma seperated list is converted into comma seperated array
    it("Test for formatToCommaSeparatedList method for space seperated input", function () {
        expect(ctrl.formatToCommaSeparatedList("1 4 5")).toEqual(['1', '4', '5']);
    });

    it("Test for formatToCommaSeparatedList method for comma seperated input", function () {
        expect(ctrl.formatToCommaSeparatedList("121, 4, 5")).toEqual(['121', '4', '5']);
    });

    it("Test for formatToCommaSeparatedList method for comma and space seperated input", function () {
        expect(ctrl.formatToCommaSeparatedList("1 4, 5")).toEqual(['1', '4', '5']);
    });

    //Tests to make sure input location list are numeric
    it("Checks isLocationDataValid method functionality returns true for numeric values", function () {
        expect(ctrl.isLocationDataValid(['1', '121', '53456'])).toEqual(true);
    });

    it("Checks for checkForInvalidLocations method returns the valid results ", function () {
        ctrl.data = { "validStoreInfo": [{ "storeNumber": 121, "storeName": "CUMBERLAND", "marketNumber": 337 }], "inValidStoreInfo": [1, 2] };
        expect(ctrl.checkForInvalidLocations(ctrl.data)).toEqual([1, 2]);
    });

    it("Checks for checkForInvalidLocations method returns the valid results with inValidMarketInfo ", function () {
        ctrl.data = { "validStoreInfo": [{ "storeNumber": 121, "storeName": "CUMBERLAND", "marketNumber": 337 }], "inValidMarketInfo": [1, 2] };
        expect(ctrl.checkForInvalidLocations(ctrl.data)).toEqual([1, 2]);
    });

    it("Checks for checkForInvalidLocations method returns the valid results without inValidStoreInfo and inValidMarketInfo ", function () {
        ctrl.data = { "validStoreInfo": [{ "storeNumber": 121, "storeName": "CUMBERLAND", "marketNumber": 337 }] };
        expect(ctrl.checkForInvalidLocations(ctrl.data)).toEqual([]);
    });

    it("Calls setStoreData", function () {

        var storeData = { "validStoreInfo": [{ "storeNumber": 121, "storeName": "CUMBERLAND", "marketNumber": 337 }] };
        ctrl.data = [];
        ctrl.locationSearch = 121;
        ctrl.validStoreInfo = [];

        spyOn(ctrl, "setStoreData").and.callThrough();

        ctrl.setStoreData(storeData, true);

        expect(ctrl.checkForInvalidLocations(storeData)).toEqual([]);

        expect(ctrl.setStoreData).toHaveBeenCalled();

    });


    it('Checks for search Method to invoke getStoresById when stores are entered as input', function () {
        ctrl.data = { "locationType": "stores" };
        spyOn(ctrl, "getStoresByID");
        ctrl.search('121');
        expect(ctrl.getStoresByID).toHaveBeenCalled();

    });

    it('Checks for search Method to invoke getMarketsByID when stores are entered as input', function () {
        ctrl.data = '121 123a';
        ctrl.locationType = 'markets'
        spyOn(ctrl, "getMarketsByID");
        ctrl.search(ctrl.data);
        expect(ctrl.getMarketsByID).toHaveBeenCalledWith({ locationNumbers: ['121', '123a'] }, true);

    });

    it('Checks for search Method to invoke getMarketsByID when stores are entered as input', function () {
        ctrl.data = '';
        ctrl.locationType = 'markets'
        spyOn(ctrl, "getMarketsByID");
        spyOn(ctrl, "checkForEmptyValues").and.returnValue(false);
        ctrl.search(ctrl.data);
        expect(ctrl.getMarketsByID.calls.count()).toEqual(0);

    });
    //LOCATIONS END

    it('Verify removeStore removes the correct store', function(){
       ctrl.validStoreInfo= [{ "storeNumber": 121, "storeName": "CUMBERLAND", "marketNumber": 337 },{ "storeNumber": 123, "storeName": "Some Store", "marketNumber": 337 }] ;
       ctrl.removeStore(121);
       expect(ctrl.validStoreInfo.length).toEqual(1);
       expect(ctrl.validStoreInfo[0].storeNumber).toEqual(123);
    });

    it('Verify removeMarket removes the correct store', function(){
        ctrl.validMarketInfo= [{ "marketNumber": 1, "marketName": "ATLANTA" },{ "marketNumber": 2, "marketName": "Some Market"}] ;
        ctrl.removeMarket(1);
        expect(ctrl.validMarketInfo.length).toEqual(1);
        expect(ctrl.validMarketInfo[0].marketNumber).toEqual(2);
    });

});
