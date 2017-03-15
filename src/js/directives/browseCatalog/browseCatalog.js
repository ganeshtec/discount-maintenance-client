app.directive('browseCatalog', ['endecaDataService', 'DataFactory',
    function (endecaDataService, DataFactory) {
        return {
            restrict: 'E',
            templateUrl: 'browseCatalog.html',
            link: function (scope) {

                scope.data = $.extend(true, [], scope.data);

                scope.$on('btnBrowseOnClick', function () {
                    scope.browseCatalogOverlayConfig.open();
                });

                scope.close = function () {
                    scope.browseCatalogOverlayConfig.close();
                }

                scope.searchCatalog = function (term) {
                    var endecaCatalogResponse = endecaDataService.getSalesCatalog(term);
                    endecaCatalogResponse.then(
                        function (data) {
                            scope.endecaCatalogResponse = data.results;
                        },
                        function (error) {
                            DataFactory.messageModal.message = error;
                            DataFactory.messageModal.title = 'Error';
                            $('#messageModal').popup();
                        });
                }

                scope.addCategory = function (event, category) {

                    var details = {};

                    details.id = category.source;
                    details.category = category.category;
                    details.name = category.name;
                    details.source = category.id;

                    var isChecked = event.target.checked ? true : false;

                    if (isChecked) {
                        scope.$emit('addedCategory', details);
                    } else {
                        scope.$emit('deletedCategory', details);
                    }
                }

                scope.indent = function (index) {
                    return {
                        'margin-left': 50 * index + 'px'
                    };
                }

            }
        };
    }
]);
