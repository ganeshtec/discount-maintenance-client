app.component('channelSelect', {
    bindings: {
        data: '=',
        uistate: '<',
        preview: '='
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
            "name": "Quote Center",
            "id": 1011
        },      
        {
            "name": "Online",
            "id": 57
        },        
        {
            "name": "POS",
            "id": 87
        },
        {
            "name": "www.HomeDepot.com",
            "id": 999
        }
    ];

    ctrl.data.channelsWithCheckedFields = ctrl.channels.map(channel => {
        var newChannel = channel;
        newChannel.checked = false;
        return newChannel;
    })

    $scope.$$postDigest(function () {
        new CheckboxGroup('cbg1').init();
    });
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        var indexOfFalse = ctrl.data.channelsWithCheckedFields.findIndex(channel => {
            return channel.checked === false;
        })
    
        ctrl.data.channelsWithCheckedFields.forEach(channel => {
            channel.checked = (indexOfFalse !== -1);
        });
    };

    console.log("Preview? - ", ctrl.preview);
};
