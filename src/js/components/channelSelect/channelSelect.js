app.component('channelSelect', {
    bindings: {
        data: '=',
        uistate: '<'
    },
    templateUrl: 'channelSelect.html',
    controller: ChannelSelectController

});

function ChannelSelectController($scope) {
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



    $scope.$$postDigest(function () {
        console.log('Initializing');
        new CheckboxGroup('cbg1').init();
    });
    
}
