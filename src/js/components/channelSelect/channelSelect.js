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
                new CheckboxGroup('cbg1').init();// eslint-disable-line no-undef
                ctrl.data.channelsWithCheckedFields.forEach(function(channel, index){
                    if(channel.checked === true){
                        var elementOfTrueChannel = angular.element( document.querySelector( '#cond' + (index + 1) ) );
                        elementOfTrueChannel.attr('aria-checked','true');
                    }  
                })
            });
            ctrl.updateScopeWithNewChannels();
        }
    )

 
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
        channel.checked = !channel.checked;
        ctrl.updateScopeWithNewChannels()
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        var falseChannels = ctrl.data.channelsWithCheckedFields.filter(function(channel){
            return !channel.checked
        })
        ctrl.data.channelsWithCheckedFields.forEach(function(channel){
            channel.checked = falseChannels.length != 0 ? true : false
        });
        ctrl.updateScopeWithNewChannels()
    };

    ctrl.updateScopeWithNewChannels = function(){
        var selectedChannels = ctrl.data.channelsWithCheckedFields.filter(function(channel){
            return channel.checked
        }).map(function(channel){
            return channel.id
        })
        ctrl.data.channels = selectedChannels
        
    }

}
