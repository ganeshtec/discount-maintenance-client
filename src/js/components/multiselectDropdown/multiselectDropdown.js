/* eslint-disable no-unused-vars */
app.component('multiselectDropdown', {
    templateUrl: 'multiselectDropdown.html',
    bindings: {
        options: '<',
        prefix: '@',
        suffix: '@',
        label:'@',
        labelDelimiter: '@',
        selectedOptions: '=',
        notifyCompletion: '<',
        preview: '='
    },
    controller: multiselectDropdownController

});

multiselectDropdownController.$inject = ['$filter', '$scope'];
function multiselectDropdownController($filter, $scope) {
    this.selectionChanged = selectionChanged;
    this.getOptionLabel = getOptionLabel;
    this.selectAll = selectAll;
    this.setCheckAll = setCheckAll;
    this.checkAll = false;

    this.$onChanges = function(e) {
        if(e['label']) {
            this.label = angular.isArray(this.label) ? this.label : this.label.split(',');
        }
        if(e['labelDelimiter']) {
            this.labelDelimiter = this.labelDelimiter ? this.labelDelimiter : '-';
        }
        if(e['suffix']) {
            this.suffix = this.suffix ? this.suffix : 'options';
        }
        if(e['prefix']) {
            this.prefix = this.prefix ? this.prefix : 'Selected';
        }
        if(e['notifyCompletion'] || e['options']) {
            this.optionText = 'Select ' + this.suffix;
        }
    }

    function selectionChanged() {
        this.selectedOptions = [];
        for(var i=0; i < this.options.length; i++){
            if(this.options[i].checked) {
                this.selectedOptions.push(this.options[i]);
            }
        }

        if(this.selectedOptions.length === 0 ) {
            this.optionText = 'Select ' + this.suffix;
        } else if(this.selectedOptions.length === 1 ) {
            this.optionText = this.getOptionLabel(this.selectedOptions[0]);
        } else {
            this.optionText = this.prefix + ' ' + this.selectedOptions.length + ' of ' + this.options.length + ' ' + this.suffix;
        }
        this.setCheckAll();
    }

    function setCheckAll() {
        if(this.selectedOptions.length == 0) {
            this.checkAll = false;
        } else if(this.selectedOptions.length == this.options.length) {
            this.checkAll = true;
        } else {
            this.checkAll = 'mixed';
        }
    }

    function getOptionLabel(option) {
        var optionLabel = '';
        for(var i=0; i < this.label.length; i++){
            optionLabel += option[this.label[i]] + '-';
        }
        optionLabel = optionLabel.substring(0,optionLabel.length-1);
        return optionLabel;
    }

    function selectAll(){
        for(var i=0; i < this.options.length; i++){
            this.options[i].checked = this.checkAll;
            if(this.checkAll) {
                this.selectedOptions.push(this.options[i]);
            }
        }
        if(!this.checkAll) {
            this.selectedOptions.splice(0, this.selectedOptions.length);
        }
    }
}

app.factory('clickAnywhereButHereService', function($document){
    var tracker = [];
  
    return function($scope, expr) {
        var i, t, len;
        for(i = 0, len = tracker.length; i < len; i++) {
            t = tracker[i];
            if(t.expr === expr && t.scope === $scope) {
                return t;    
            }
        }
        var handler = function() {
            $scope.$apply(expr);
        };

        $document.on('click', handler);

        $scope.$on('$destroy', function(){
            $document.off('click', handler);
        });

        t = { scope: $scope, expr: expr };
        tracker.push(t);
        return t;
    };
});
  
app.directive('clickAnywhereButHere', function($document){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            var elemClickHandler = function(e) {
                e.stopPropagation();
            };

            var docClickHandler = function() {
                scope.$apply(attr.clickAnywhereButHere);
            };

            elem.on('click', elemClickHandler);
            $document.on('click', docClickHandler);

            scope.$on('$destroy', function() {
                elem.off('click', elemClickHandler);
                $document.off('click', docClickHandler);
            });
        }
    }
});

app.directive('master',function () {
    function link(scope, element, attrs) {
        scope.$watch(function(){
            scope.style = {
                width:element[0].offsetWidth+'px'
            };
        });
    }
    return {
        restrict: 'A',
        link: link
    };
}); 
