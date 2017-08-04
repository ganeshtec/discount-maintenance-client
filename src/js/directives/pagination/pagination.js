app.directive('pagination', ['$anchorScroll', function ($anchorScroll) {
    return {
        restrict: 'E',
        templateUrl: 'pagination.html',
        scope: {
            config: '=',
            onpagechange: '&',
            onsizechange: '&'
        },
        controller: function () {},
        link: function (scope) {
            scope.pages = [];
            var config = scope.config;
            scope.repaint = function () {
                // Starting page
                var currentPage = parseInt(config.currentPage || 1);
                config.currentPage = currentPage;
                // Number of rows to be displayed in a page
                var recordsPerPage = parseInt(config.recordsPerPage || 5);
                // Number of pages to diplay between next and previous buttons
                var paginationLength = parseInt(config.paginationLength || 5);
                // Total number of records
                var totalRecords = parseInt(config.totalRecords || 30);
                //Number of rcords displayed in the last Page
                var lastPageRecords = totalRecords % recordsPerPage;
                //Total Pages
                var totalPages = (totalRecords - lastPageRecords) / recordsPerPage;
                if (lastPageRecords != 0) {
                    totalPages++;
                }
                scope.totalPages = totalPages;
                // First page after the previous button
                var firstPage;
                if (firstPage < paginationLength) {
                    firstPage = 1;
                } else if (currentPage % paginationLength === 0) {
                    firstPage = currentPage - paginationLength + 1;
                } else {
                    firstPage = currentPage - (currentPage % paginationLength) + 1;
                }
                if (firstPage <= 0) {
                    firstPage = 1;
                }
                //Last page before the next button
                var lastPage = firstPage + paginationLength - 1;
                if (lastPage > totalPages) {
                    lastPage = totalPages;
                    firstPage = lastPage - paginationLength;
                }
                if (firstPage <= 0) {
                    firstPage = 1;
                }
                scope.rowStart = (currentPage - 1) * recordsPerPage + 1;
                scope.rowEnd = scope.rowStart + recordsPerPage - 1;
                if (scope.rowEnd > totalRecords) {
                    scope.rowEnd = totalRecords;
                }
                if (lastPage != totalPages) {
                    scope.hasMorePages = true;
                }
                scope.setPage = function (no) {
                    scope.onpagechange()(no);
                }
                scope.isCurrentPage = function (no) {
                    return scope.config.currentPage == no;
                }
                scope.pages = [];
                scope.totalRecords = totalRecords;
                for (var i = firstPage; i <= lastPage; i++) {
                    var page = {};
                    page.no = i;
                    if (i == currentPage) {
                        page.current = true;
                    }
                    scope.pages.push(page);
                }

                $anchorScroll();

            }

            scope.repaint();
            scope.$watch('config.currentPage + config.recordsPerPage + config.totalRecords', function () {
                scope.repaint();
            });
            scope.changeSize = function () {
                scope.onsizechange()(scope.config.recordsPerPage);
            };
            scope.previous = function () {
                scope.setPage(parseInt(scope.config.currentPage) - 1);
            };
            scope.next = function () {
                scope.setPage(parseInt(scope.config.currentPage) + 1);
            };
        }
    }
}]);
