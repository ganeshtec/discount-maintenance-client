app.service('DataFactory', [function(){
    var publicApi = {};
    publicApi.messageModal = {};
    publicApi.environment = 'https://promotionsws-ad.apps-np.homedepot.com/v1';
    return publicApi;
}]);