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

function ChannelSelectController($scope,$filter, promotionDataService, utilService) {
    var ctrl = this;
    var promise = promotionDataService.getSelectionChannels();

    promise.then(
        function(channels) {
            ctrl.data.channelsWithCheckedFields = channels.map(function(channel) {
                var newChannel = channel;
                if(ctrl.data.purchaseConds.channels.includes(channel.id)){
                    newChannel.checked = true;
                    if(channel.id === 87){
                        newChannel.disabled = true;
                    }else{
                        newChannel.disabled = false;
                    }      
                } else {
                    
                    newChannel.checked = false;
                    newChannel.disabled = false;
                }
                return newChannel;
            })

            $scope.$$postDigest(function () {
                new CheckboxGroup('cbg1').init();// eslint-disable-line no-undef
                ctrl.data.channelsWithCheckedFields.forEach(function(channel, index){
                    if(channel.checked){
                        var elementOfTrueChannel = angular.element( document.querySelector( '#cond' + (index + 1) ) );
                        elementOfTrueChannel.attr('aria-checked','true');
                        if(utilService.isPrintLabelChecked(ctrl.data) && channel.id === 87){
                            elementOfTrueChannel.attr('aria-disabled','true');
                            channel.disabled = true;
                        }else{
                            elementOfTrueChannel.attr('aria-disabled','false');
                            channel.disabled = false;
                        }
                    }
                })    
                console.log('channelsWithCheckedFields', ctrl.data.channelsWithCheckedFields)
            });
            ctrl.updateScopeWithNewChannels();
        }
    )
    
    ctrl.updateSingleChannelCheckBoxValue = function(channel){
            channel.checked = !channel.checked;
            ctrl.updateScopeWithNewChannels();
            utilService.updatePrintLabel(ctrl.data);
    }

    ctrl.CheckToClick = function(channel){
        if(utilService.isPrintLabelChecked(ctrl.data) && channel.id === 87){
            return false
        }else{
            return true
        }    
    }
    
    ctrl.updateAllChannelCheckBoxValues = function(){

        var falseChannels = ctrl.data.channelsWithCheckedFields.filter(function(channel){
            return !channel.checked
        })
        ctrl.data.channelsWithCheckedFields.forEach(function(channel){
            channel.checked = falseChannels.length != 0 ? true : false
        });
        ctrl.updateScopeWithNewChannels();
        utilService.updatePrintLabel(ctrl.data);
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
