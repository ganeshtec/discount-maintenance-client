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
             });
        }
    )

 
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked;
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        // var indexOfFalse = ctrl.data.channelsWithCheckedFields.findIndex(function(channel) {
        //     return channel.checked === false;
        // })

        var indexOfFalse = [];
        for (i=0; i<ctrl.data.channelsWithCheckedFields.length; i++) {
            if (ctrl.data.channelsWithCheckedFields[i].checked !== true) {
                indexOfFalse += i;
            }
        }
        console.log("INDEX OF FALSE - ", indexOfFalse);
        // ctrl.data.channelsWithCheckedFields.forEach(function(channel){
        //     channel.checked = (indexOfFalse !== -1);
        // });

        ctrl.data.channelsWithCheckedFields.forEach(function(channel){
            if (indexOfFalse.length === 0) {
                channel.checked = false;
            } else {
                channel.checked = true;
            }
        });
    };

}
