app.component('channelSelect', {
    bindings: {
        data: '=',
        promotype: '<',
        uistate: '<',
        urls: '<',
    },
    templateUrl: 'channelSelect.html',
    controller: ChannelSelectController
});

function ChannelSelectController() {
    var ctrl = this;
    ctrl.channels = [
        {
            "name": "eSVS",
            "id": 789
        },
        {
            "name": "Order Up",
            "id": 456
        },
        {
            "name": "Online",
            "id": 57
        },
        {
            "name": "Quote Center",
            "id": 1011
        },                    
        {
            "name": "POS",
            "id": 87
        }
    ];
    ctrl.$onInit = function () {
        new CheckboxGroup('cbg1').init();
    }
}
