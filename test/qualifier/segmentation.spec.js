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

    
});
