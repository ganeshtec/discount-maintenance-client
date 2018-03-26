describe('Unit testing qualifiers component', function () {
    var $componentController;
        
    beforeEach(module('app'));

    beforeEach(function(){
        module("app", function($provide) {
            $provide.constant("MaxCouponGenerationLimit", 300000);
        });
    });

    beforeEach(inject(function (_$componentController_ ) {

        $componentController = _$componentController_;
        ctrl = $componentController('qualifiers', null, {
            data: {
                
                    reward: {},
                    promoCdSpec: {
                        systemGen: {}
                    },
                    purchaseConds:{
                        program:{

                        }
                    },
                    segment:{}
            },
            "useCustSegReasonCode": false
        }
    );
    }));

   

    it('No Segment Selected', function () {
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
        expect(ctrl.data.reward.reasonCode).toBe(49);
    });

    it('Program Segment Selected', function () {
        ctrl.data.segment = {"segmentName":"PRO XTRA PAINT REWARDS-Bronze","progId":2,"tierId":8};
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(0);
        expect(ctrl.data.purchaseConds.program.id).toBe(2);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(8);
        expect(ctrl.data.reward.reasonCode).toBe(49);
    });

    it('Customer Segment Selected', function () {
        ctrl.data.segment = {"id":13550,"segmentName":"Segment 919"};
        ctrl.useCustSegReasonCode = true;
        ctrl.onSegmentSelection();
        expect(ctrl.data.purchaseConds.customerSegmentId).toBe(13550);
        expect(ctrl.data.purchaseConds.program.id).toBe(0);
        expect(ctrl.data.purchaseConds.program.tierId).toBe(0);
        expect(ctrl.data.reward.reasonCode).toBe(70);
    });

    it('Rapid Pass not selected', function () {
        ctrl.data.checkRapidPass = false;
        ctrl.selectRapidPass();
            
        expect(ctrl.data.promoCdSpec.type).toBe('');
        expect(ctrl.data.promoCdSpec.genType).toBe('');
        expect(ctrl.data.promoCdSpec.cdLength).toBe('');
        expect(ctrl.data.rapidPassCouponLimit).toBe('');
        expect(ctrl.data.promoCdRqrd).toBe(false);
        expect(ctrl.data.promoCdSpec.systemGen).toBe(undefined);


    });

    it('Rapid Pass selected', function () {
        ctrl.data.checkRapidPass = true;
        ctrl.data.segment.id = 12345;
        ctrl.selectRapidPass();
            
        expect(ctrl.data.promoCdSpec.type).toBe('Private');
        expect(ctrl.data.promoCdSpec.genType).toBe('Dynamically Generated');
        expect(ctrl.data.promoCdSpec.cdLength).toBe('13');
        expect(ctrl.data.rapidPassCouponLimit).toBe(undefined);

        expect(ctrl.data.promoCdSpec.systemGen.uniqueCdCnt).toBe('');
        expect(ctrl.data.promoCdSpec.systemGen.cdPrefix).toBe('010012345');
        expect(ctrl.data.promoCdSpec.systemGen.cdSuffix).toBe('');
        expect(ctrl.data.promoCdRqrd).toBe(true);
    });

    it('initialize for Edit mode of Active promotion', function () {
        ctrl.data.promoCdSpec.genType = 'Dynamically Generated';
        ctrl.data.rapidPassCouponLimit = NaN;
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 30;
        ctrl.data.status = 61;

        ctrl.initialize();

        expect(ctrl.data.checkRapidPass).toBe(true);
        expect(ctrl.data.rapidPassCouponLimit).toBe(30);
        expect(ctrl.data.disableRapidPass).toBe(true);
        
    });

    it('initialize for Edit mode of Non Active promotion', function () {
        ctrl.data.promoCdSpec.genType = 'Dynamically Generated';
        ctrl.data.rapidPassCouponLimit = NaN;
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = 30;
        ctrl.data.status = 57;

        ctrl.initialize();

        expect(ctrl.data.checkRapidPass).toBe(true);
        expect(ctrl.data.rapidPassCouponLimit).toBe(30);
        expect(ctrl.data.disableRapidPass).toBe(false);
        
    });

    it('initialize for new promotion', function () {
        ctrl.data.promoCdSpec.genType = '';
        ctrl.data.rapidPassCouponLimit = NaN;
        ctrl.data.promoCdSpec.systemGen.uniqueCdCnt = '';
        ctrl.data.checkRapidPass = false;
        ctrl.initialize();
        expect(ctrl.data.checkRapidPass).toBe(false);
  
    });

    it('initialize for preview promotion', function () {
        ctrl.data.rapidPassCouponLimit = 50;
        ctrl.data.checkRapidPass = true;
        ctrl.initialize();
        expect(ctrl.data.promoCdSpec.systemGen.uniqueCdCnt).toBe(50);
    });

    
});
