// Purpose is to build promotion code spec.
app.directive('promotionCodeSpecification', ['promotionDataService', 'PROMOCODE', 'DataFactory',
    function (promotionDataService, PROMOCODE, DataFactory) {
        return {
            restrict: 'E',
            templateUrl: 'promotionCodeSpecification.html',
            scope: {
                data: '=',
                require: '=',
                promoform: '=',
                preview: '=',
                couponid: '='
            },
            link: function (scope) {
                scope.data = scope.data || new PROMOCODE();
                scope.$watch('data.type', function (model) {
                    if (model === 'Public') {
                        delete scope.data.systemGen;
                        scope.data.genType = 'user';
                    } else {
                        delete scope.data.promoCodes;
                        scope.data.genType = 'system generated';
                    }
                });
                scope.clearCouponId = function () {
                    scope.couponid = null;
                }

                function getCodeStatus(couponid) {
                    var status = promotionDataService.codeGenStatus(couponid);
                    status.then(
                        function (res) {
                            var status = res.ProcessStatusCode;
                            scope.completed = scope.data.systemGen && (status == 'completed');
                        },
                        function (error) {
                            DataFactory.messageModal.message = error;
                            DataFactory.messageModal.title = 'Error';
                            $('#messageModal').popup();
                        });
                }
                if (scope.couponid) {
                    getCodeStatus(scope.couponid)
                }
            }
        };
    }
]);
