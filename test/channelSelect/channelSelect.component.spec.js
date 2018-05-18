describe('Unit testing channelSelect component', function () {
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
                ],
            "printLabel": true
            }

        }
        );

    }));



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
        ctrl.$onInit();
        //ctrl.updateAllChannelCheckBoxValues();
        ctrl.selectAll();
        expect(ctrl.data.channelsWithCheckedFields[0].checked).toBe(false);
        expect(ctrl.data.channelsWithCheckedFields[1].checked).toBe(false);
    });

    it('filters for only true channels, and only returns the id for each true channel', function () {
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
        },
        {
            "name": "Pro eCommerce",
            "id": 130,
            "code": "PEC",
            "checked": true
        }
        ];
        ctrl.updateScopeWithNewChannels()
        expect(ctrl.data.channels.length).toBe(2)
        expect(ctrl.data.channels[0]).toBe(105)
        expect(ctrl.data.channels[1]).toBe(130)
    })

    it('Test #selectionChanged', function () {
        ctrl.data.channelsWithCheckedFields[0].checked = true;
        ctrl.selectionChanged();
        expect(ctrl.selectedOptions.length).toEqual(1);
        expect(ctrl.checkAll).toEqual('mixed');
    });

    it('check if channel is anything other than POS is not disabled', function () {
        var channel = {
            "name": "Pro eCommerce",
            "id": 130,
            "code": "PEC",
            "checked": false
        }
        ctrl.disableChannel(channel);

        expect(channel.disable).toBe(false);


    });

    it('check if channel is POS and Print label is checked then POS is disabled', function () {
        var channel = {
            "name": "Point Of Sale",
            "id": 87,
            "code": "POS",
            "checked": true
        }

        ctrl.disableChannel(channel);
        expect(channel.disable).toBe(true);

    });

    it('check if channel is POS & Unchecked and Print label is checked then POS is not disabled', function () {
        var channel = {
            "name": "Point Of Sale",
            "id": 87,
            "code": "POS",
            "checked": false
        }

        ctrl.disableChannel(channel);
        expect(channel.disable).toBe(false);

    });

     it('Test #setCheckAll', function () {
        ctrl.selectedOptions = [ctrl.data.channelsWithCheckedFields[0]];
        ctrl.setCheckAll();
        expect(ctrl.checkAll).toEqual('mixed');

        ctrl.selectedOptions = [];
        ctrl.setCheckAll();
        expect(ctrl.checkAll).toEqual(false);

        ctrl.selectedOptions = [ctrl.data.channelsWithCheckedFields[0],ctrl.data.channelsWithCheckedFields[1],ctrl.data.channelsWithCheckedFields[2],ctrl.data.channelsWithCheckedFields[3],ctrl.data.channelsWithCheckedFields[4]];
        ctrl.setCheckAll();
        expect(ctrl.checkAll).toEqual(true);
    });

    it('Test #selectAll', function () {
        //select all options
        ctrl.checkAll = true;
        ctrl.selectAll();
        expect(ctrl.selectedOptions.length).toEqual(5);
        expect(ctrl.checkAll).toEqual(true);

        //unselect all options
        ctrl.checkAll = false;
        ctrl.selectAll();
        expect(ctrl.selectedOptions.length).toEqual(1);
        expect(ctrl.checkAll).toEqual('mixed');
    });
});
