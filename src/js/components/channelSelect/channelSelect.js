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

    ctrl.channelsWithCheckedFields = ctrl.channels.map(channel => {
        var newChannel = channel;
        newChannel.checked = false;
        return newChannel;
    })

    $scope.$$postDigest(function () {
        new CheckboxGroup('cbg1').init();
    });
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked
        console.log($scope)
        console.log("New Status: " + channel.name +  " " + channel.checked)
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        var indexOfFalse = ctrl.channelsWithCheckedFields.findIndex(channel => {
            return channel.checked === false;
        })
    
        ctrl.channelsWithCheckedFields.forEach(channel => {
            channel.checked = (indexOfFalse !== -1);
        });
    };
};
