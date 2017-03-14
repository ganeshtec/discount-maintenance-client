/* 
    State Service 
    Services that will handle setting common state of ui properties
*/

app.service('stateService', [function () {
    var publicApi = {};

    // Method to deactivate all sections, expected to have property .isActive
    publicApi.deactivateSection = function (data) {
        $(data).each(function (i, val) {
            val.isActive = false;
        });
        return data;
    }

    return publicApi;

}]);