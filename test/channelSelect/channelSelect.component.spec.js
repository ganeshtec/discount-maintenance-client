fdescribe('Unit testing channelSelect component', function () {
    var $componentController,
        $compile,
        $rootScope,
        promotionDataService,
        $scope;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$componentController_, _$compile_, _$rootScope_, _promotionDataService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $componentController = _$componentController_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        promotionDataService = _promotionDataService_;
        $scope = $rootScope.$new();

        ctrl = $componentController('channelSelect', null, {
            data: { 
                channelsWithCheckedFields:
                    [
                        {
                            "name": "Internet Sales",
                            "id": 57,
                            "code": "INET",
                            "checked": false
                        },
                        {
                            "name": "Point Of Sale",
                            "id": 87,
                            "code": "POS",
                            "checked": false
                        },
                        {
                            "name": "Order Up",
                            "id": 100,
                            "code": "ORDERUP",
                            "checked": false
                        },
                        {
                            "name": "Pro Desk",
                            "id": 105,
                            "code": "PRODSK",
                            "checked": false
                        },
                        {
                            "name": "Quote Center",
                            "id": 110,
                            "code": "QC",
                            "checked": false
                        },
                        {
                            "name": "Pro eCommerce",
                            "id": 130,
                            "code": "PEC",
                            "checked": false
                        }
                    ]
                }
            }
        );

    }));

    it('updates one checkbox by toggling the model value', function () {
        var channel = {
            "name": "Pro eCommerce",
            "id": 130,
            "code": "PEC",
            "checked": false
        }
        ctrl.updateSingleChannelCheckBoxValue(channel);
        expect(channel.checked).toBe(true);

        ctrl.updateSingleChannelCheckBoxValue(channel);
        expect(channel.checked).toBe(false);
    });

    it('updates all checkbox values to true if any are false', function () {
        ctrl.data.channelsWithCheckedFields = [{
                        "name": "Internet Sales",
                        "id": 57,
                        "code": "INET",
                        "checked": false
                    },
                    {
                        "name": "Pro Desk",
                        "id": 105,
                        "code": "PRODSK",
                        "checked": true
                    }
                ];
        
        console.log(ctrl.data.channelsWithCheckedFields);
        ctrl.updateAllChannelCheckBoxValues();
        expect(ctrl.data.channelsWithCheckedFields[0].checked).toBe(true);
        expect(ctrl.data.channelsWithCheckedFields[1].checked).toBe(true);
    });

    it('updates all checkbox values to true if all are false', function () {
        ctrl.data.channelsWithCheckedFields = [{
                        "name": "Internet Sales",
                        "id": 57,
                        "code": "INET",
                        "checked": false
                    },
                    {
                        "name": "Pro Desk",
                        "id": 105,
                        "code": "PRODSK",
                        "checked": false
                    }
                ];
        
        console.log(ctrl.data.channelsWithCheckedFields);
        ctrl.updateAllChannelCheckBoxValues();
        expect(ctrl.data.channelsWithCheckedFields[0].checked).toBe(true);
        expect(ctrl.data.channelsWithCheckedFields[1].checked).toBe(true);
    });

    it('updates all checkbox values to false if all are true', function () {
        ctrl.data.channelsWithCheckedFields = [
                    {
                        "name": "Internet Sales",
                        "id": 57,
                        "code": "INET",
                        "checked": true
                    },
                    {
                        "name": "Pro Desk",
                        "id": 105,
                        "code": "PRODSK",
                        "checked": true
                    }
                ];
        
        console.log(ctrl.data.channelsWithCheckedFields);
        ctrl.updateAllChannelCheckBoxValues();
        expect(ctrl.data.channelsWithCheckedFields[0].checked).toBe(false);
        expect(ctrl.data.channelsWithCheckedFields[1].checked).toBe(false);
    });
});