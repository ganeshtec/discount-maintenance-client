app.service('configService', ['$http','$q',
    function ($http,$q){
      var service={};
      service.getConfig = function(){
          var config = $q.defer();
          $http(
            {
                method: 'GET',
                url: '/ssoConfig.json',
                cache: true,
                headers: {
                    'Accept': 'application/json',
                }
            }
          ).then(function(response){
            config.resolve(response.data);
          },function(error){
            config.reject(error);
          });
          return config.promise;
        }
      return service;
      }
]);
