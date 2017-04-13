// Purpose is to build purchase conditions.
app.directive('purchaseCondition', ['purchaseCondition',
    function (purchaseCondition) {
        return {
            restrict: 'E',
            templateUrl: 'purchaseCondition.html',
            scope: {
                data: '=',
                reward: '=',
                qualUOM: '=',
                promoform: '=',
                preview: '=',
                isDisabled: '=',
                purchaseCondition: '=',
                promotype: '='
            },

            link: function (scope) {

                scope.setQualUOM = function (qualuom) {
                    var temp = qualuom;
                    scope.data.qualUOM = temp;
                    if (scope.data) {
                        for (var i = 0; i < scope.data.length; i++) {
                            scope.data[i].qualUOM = qualuom;
                        }
                    }

                }
                scope.addPurchaseCondition = function () {
                    scope.data = scope.data || [];
                    var condition = new purchaseCondition();
                    scope.data.push(condition);
                }

                scope.removePurchaseCondition = function (index) {
                    scope.data.splice(index, 1);
                }

                if (scope.data && !scope.data.length) {
                    scope.addPurchaseCondition();

                }

                scope.roundPercentage = function(dataIndex) {
                    if (scope.data[dataIndex].value) {
                        scope.data[dataIndex].value = parseFloat(scope.data[dataIndex].value).toFixed(2);                
                    }
                }
            }
        };
    }
]);
