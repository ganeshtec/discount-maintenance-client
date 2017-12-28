app.component('channelSelect', {
    bindings: {
        data: '=',
        uistate: '<',
        preview: '=',
        viewProp: '='
    },
    templateUrl: 'channelSelect.html',
    controller: ChannelSelectController
});

function ChannelSelectController($scope, promotionDataService) {
    var ctrl = this;
    var promise = promotionDataService.getSelectionChannels()

    promise.then(
        function(channels) {
            ctrl.data.channelsWithCheckedFields = channels.map(function(channel) {
                var newChannel = channel;
                newChannel.checked = channel.id === 87 ? true : false;
                return newChannel;
            })
            $scope.$$postDigest(function () {
                new CheckboxGroup('cbg1').init();
                console.log("VIEW PROP - ", ctrl.viewProp);
             });
        }
    )

 
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked
        console.log(channel.name + channel.checked)
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        var indexOfFalse = ctrl.data.channelsWithCheckedFields.findIndex(function(channel) {
            return channel.checked === false;
        })
    
        ctrl.data.channelsWithCheckedFields.forEach(function(channel){
            channel.checked = (indexOfFalse !== -1);
        });
    };

    
}
