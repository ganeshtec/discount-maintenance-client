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
        preview: '='
    },
    controller: multiselectDropdownController

});

multiselectDropdownController.$inject = ['$filter', '$scope'];
function multiselectDropdownController($filter, $scope) {
    this.setup = function() {
        this.labelDelimiter = this.labelDelimiter ? this.labelDelimiter : '-';
        this.suffix = this.suffix ? this.suffix : 'options';
        this.prefix = this.prefix ? this.prefix : 'Selected';
        this.label = angular.isArray(this.label) ? this.label : this.label.split(',');
        this.optionText = 'Select ' + this.suffix;
    }

    this.$onChanges = function(e) {
        this.setup();
    }

    this.selectionChanged = function() {
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
    }

    this.getOptionLabel = function(option) {
        var optionLabel = '';
        for(var i=0; i < this.label.length; i++){
            optionLabel += option[this.label[i]] + '-';
        }
        optionLabel = optionLabel.substring(0,optionLabel.length-1);
        return optionLabel;
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
