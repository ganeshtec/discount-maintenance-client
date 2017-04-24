app.component('purchaseCondition', {
    templateUrl: 'purchaseCondition.html',
    bindings: {
        data: '=',
        reward: '=',
        qualUOM: '=',
        promoform: '=',
        preview: '=',
        isDisabled: '=',
        purchaseCondition: '=',
        promotype: '='
    },
    controller: function PurchaseCondition() {

        function setQualUOM(qualuom) {
            var temp = qualuom;
            data.qualUOM = temp;
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].qualUOM = qualuom;
                }
            }
        }

        function addPurchaseCondition() {
            this.data = this.data || [];
            var condition = new purchaseCondition();
            this.data.push(condition);
        }

        function removePurchaseCondition(index) {
            data.splice(index, 1);
        }

        if (this.data && !this.data.length) {
            addPurchaseCondition();
        }

        function validatePercentage(dataIndex) {
            data[dataIndex].value = data[dataIndex].value;
            roundPercentage(dataIndex);
        }

        function roundPercentage(dataIndex) {
            if (data[dataIndex].value) {
                data[dataIndex].value = parseFloat((Math.round(data[dataIndex].value * 100) / 100).toFixed(2));
            }
        }

    }
});

// app.directive('purchaseCondition', ['purchaseCondition',
//     function (purchaseCondition) {
//         return {
//             restrict: 'E',
//             templateUrl: 'purchaseCondition.html',
//             scope: {
//                 data: '=',
//                 reward: '=',
//                 qualUOM: '=',
//                 promoform: '=',
//                 preview: '=',
//                 isDisabled: '=',
//                 purchaseCondition: '=',
//                 promotype: '='
//             },

//             link: function (scope) {

//                 scope.setQualUOM = function (qualuom) {
//                     var temp = qualuom;
//                     scope.data.qualUOM = temp;
//                     if (scope.data) {
//                         for (var i = 0; i < scope.data.length; i++) {
//                             scope.data[i].qualUOM = qualuom;
//                         }
//                     }

//                 }
//                 scope.addPurchaseCondition = function () {
//                     scope.data = scope.data || [];
//                     var condition = new purchaseCondition();
//                     scope.data.push(condition);
//                 }

//                 scope.removePurchaseCondition = function (index) {
//                     scope.data.splice(index, 1);
//                 }

//                 if (scope.data && !scope.data.length) {
//                     scope.addPurchaseCondition();

//                 }

//                 scope.validatePercentage = function (dataIndex) {
//                     scope.data[dataIndex].value = scope.data[dataIndex].value;
//                     scope.roundPercentage(dataIndex);
//                 }

//                 scope.roundPercentage = function (dataIndex) {
//                     if (scope.data[dataIndex].value) {
//                         scope.data[dataIndex].value = parseFloat((Math.round(scope.data[dataIndex].value * 100) / 100).toFixed(2));
//                     }
//                 }
//             }
//         };
//     }
// ]);
