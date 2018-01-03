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
                
                if(ctrl.data.purchaseConds.channels.includes(channel.id)){
                    newChannel.checked = true
                } else {
                    newChannel.checked = false
                }
                return newChannel;
            })

            $scope.$$postDigest(function () {
                new CheckboxGroup('cbg1').init();
                ctrl.data.channelsWithCheckedFields.forEach(function(channel, index){
                    if(channel.checked === true){
                        var elementOfTrueChannel = angular.element( document.querySelector( '#cond' + (index + 1) ) );
                        elementOfTrueChannel.attr('aria-checked',"true");
                    }  
                })
             });
        }
    )

 
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked;
        console.log(channel.name + channel.checked)

        // UPDATE CHANNEL OBJECT ON SCOPE WITH NEW INPUT **ONLY IF MFA IS LOGGED IN && FF IS TRUE**
        ctrl.updateScopeWithNewChannels()
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        // var indexOfFalse = ctrl.data.channelsWithCheckedFields.findIndex(function(channel) {
        //     return channel.checked === false;
        // })

        var indexOfFalse = [];
        for (i=0; i<ctrl.data.channelsWithCheckedFields.length; i++) {
            if (ctrl.data.channelsWithCheckedFields[i].checked !== true) {
                indexOfFalse.push(i);
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
         // UPDATE CHANNEL OBJECT ON SCOPE WITH NEW INPUT **ONLY IF MFA IS LOGGED IN && FF IS TRUE**
         ctrl.updateScopeWithNewChannels()
    };

    ctrl.updateScopeWithNewChannels = function(){
        var selectedChannels = ctrl.data.channelsWithCheckedFields.filter(function(channel){
            return channel.checked
        }).map(function(channel){
            return channel.id
        })

        console.log(selectedChannels)

        //set scope to be selected channels

        // $scope.$ctrl.data.purchaseConds.channels = selectedChannels
        // $scope.previewData.purchaseConds.channels = selectedChannels
        ctrl.data.channels = selectedChannels
        
    }

}
