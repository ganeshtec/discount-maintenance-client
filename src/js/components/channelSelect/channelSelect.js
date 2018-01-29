/* eslint-disable no-unused-vars */
app.component('channelSelect', {
    templateUrl: 'channelSelect.html',
    bindings: {
        data: '=',
        preview: '=',   
        viewProp: '='
    },
    controller: ChannelSelectController

});

function ChannelSelectController($filter, $scope, promotionDataService, utilService) {
    var ctrl = this;
    ctrl.selectionChanged = selectionChanged;
    ctrl.selectAll = selectAll;
    ctrl.setCheckAll = setCheckAll;
    ctrl.checkAll = false;

    ctrl.$onInit = function () {
        var promise = promotionDataService.getSelectionChannels();
        promise.then(
        function (channels) {
            ctrl.data.channelsWithCheckedFields = channels.map(function (channel) {
                var newChannel = channel;
                if (ctrl.data.purchaseConds.channels.includes(channel.id)) {
                    newChannel.checked = true;
                } else {
                    newChannel.checked = false;
                }
                return newChannel;
            })

            $scope.$watch('$ctrl.data.printLabel', function(value) {
                ctrl.data.channelsWithCheckedFields.forEach(function (channel, index) {
                    ctrl.disableChannel(channel);
                    ctrl.selectionChanged();
                })
            }, true);
            ctrl.updateScopeWithNewChannels();
        }
    )
    };

    ctrl.disableChannel = function(channel) {
        if(channel.checked && ctrl.data.printLabel && channel.id === 87){  
            channel.disable=true;
        } else {
            channel.disable=false;
        }
    }

    ctrl.updateSingleChannelCheckBoxValue = function (channel) {
        ctrl.disableChannel(channel);
        ctrl.selectionChanged();
    }

    ctrl.updateScopeWithNewChannels = function () {
        var selectedChannels = ctrl.data.channelsWithCheckedFields.filter(function (channel) {
            return channel.checked
        }).map(function (channel) {
            return channel.id
        })
        ctrl.data.channels = selectedChannels
    }

    function selectionChanged () {
        ctrl.selectedOptions = [];
        for (var i = 0; i < ctrl.data.channelsWithCheckedFields.length; i++) {
            if (ctrl.data.channelsWithCheckedFields[i].checked) {
                ctrl.selectedOptions.push(ctrl.data.channelsWithCheckedFields[i]);
            }
        }
        ctrl.setCheckAll();
        ctrl.updateScopeWithNewChannels();
        utilService.updatePrintLabel(ctrl.data);
    }

    function setCheckAll () {
        if (ctrl.selectedOptions.length === 0) {
            ctrl.checkAll = false;
        } else if (ctrl.selectedOptions.length == ctrl.data.channelsWithCheckedFields.length) {
            ctrl.checkAll = true;
        } else {
            ctrl.checkAll = 'mixed';
        }
    }

    function selectAll () {
        ctrl.selectedOptions = [];
        for (var i = 0; i < ctrl.data.channelsWithCheckedFields.length; i++) {
            if(!(ctrl.data.channelsWithCheckedFields[i].checked && ctrl.data.printLabel && ctrl.data.channelsWithCheckedFields[i].id === 87)){ 
            ctrl.data.channelsWithCheckedFields[i].checked = ctrl.checkAll;
                if (ctrl.checkAll) {
                    ctrl.selectedOptions.push(ctrl.data.channelsWithCheckedFields[i]);
                }
            }
        }
        if (!ctrl.checkAll) {
            ctrl.selectedOptions.splice(0, ctrl.selectedOptions.length);
        }
        ctrl.selectionChanged();
    }
}

