app.service('loginService', ['$http', '$location', 'URL_CONFIG','$rootScope','$window','configService','modalService',
    function ($http, $location, URL_CONFIG, $rootScope,$window,configService,modalService) {
        var publicApi = {};
        var urls = new URL_CONFIG();
        var userInfo = null;
        function getRedirectUrl(config) {
            return config.oAuthAuthorizationUrl + '?client_id='+config.appId
            + '&response_type=token&redirect_uri='+$window.location.href;
        }
        function getLogoutUrl(config){
            return config.oAuthLogoutUrl+'?client_id='+config.appId;
        }

        publicApi.getUserInfo =function(){
            return userInfo;
        }

        publicApi.getUserName = function(){
            if(userInfo!=null){
                return userInfo.userName;
            }else{
                return null;
            }
        }

        publicApi.getCurrentUserRole = function(){
            return parseInt($window.sessionStorage.getItem('currentUserRole'));
        }

        publicApi.setCurrentUserRole = function(userRole){
            $window.sessionStorage.setItem('currentUserRole',userRole);
        }

        publicApi.intercept =function(){
            var accessToken=getUrlFragment('access_token');
            if(accessToken!=null){
                userInfo={};
                userInfo.accessToken=accessToken;
                var accessTokenDetails=decodeToken(accessToken);
                userInfo.userName=accessTokenDetails.user_name;
                userInfo.tokenExpiryTime=accessTokenDetails.exp;
                $window.sessionStorage.setItem('userInfo',angular.toJson(userInfo));
                fetchUserPermissions(userInfo.userName).then(httpSuccess, httpError);
            }else{
                if(!userInfo && $window.sessionStorage.getItem('userInfo')!=null){
                    userInfo=angular.fromJson($window.sessionStorage.getItem('userInfo'));
                    $rootScope.$broadcast('user-login');
                }
                if(!userInfo || Date.now()>userInfo.tokenExpiryTime*1000){
                    $window.sessionStorage.clear();
                    this.redirectToLoginPage();
                }
            }
        }
        function fetchUserPermissions (username) {
            return $http({
                method: 'GET',
                url: urls.authorizeUrl + username + '.json',
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
        }
        function findDefaultRole(userRoles){
            //Set default user permission based on the first shortDesc alphabeticly
            var defaultRoleIndex = -1;
            //Set shortDesc and defulat user permission
            for(var i = 0; i < userRoles.length; i++){
                if(defaultRoleIndex < 0) {
                    defaultRoleIndex = i;
                }else if (userRoles[i].shortDesc < userRoles[defaultRoleIndex].shortDesc){
                    defaultRoleIndex = i;
                }
            }
            return userRoles[defaultRoleIndex].id;
        }
        function httpSuccess(response) {
            if (response.data == null || response.data == undefined || response.data == ''|| response.data.length == 0) {
                showError('Authorization Error','You are not authorized to use this application');
            } else {
                // var userPermValue =   [{id:'228', description:'SKU: Discount Engine-Store MFA'} ,{id:'229', description:'SKU: Discount Engine-Online DCM'}];
                // userPermissions = userPermValue; // (for testing)
                var userRoles = response.data.map(function(userRole){
                    return {id:userRole.id, description: userRole.description,shortDesc: userRole.description.substring(userRole.description.indexOf('-')+1)}
                });
                $window.sessionStorage.setItem('userPermissions',angular.toJson(userRoles));
                if(!publicApi.getCurrentUserRole()){
                    publicApi.setCurrentUserRole(findDefaultRole(userRoles));
                }
                $rootScope.$broadcast('user-login');
            }

        }

        function httpError() {
            showError('System Error','Error retrieving user information');
        }

        function showError(title,errorMessage) {
            modalService.showAlert(title,errorMessage);
        }
        function decodeToken(token){
            return JSON.parse(atob(token.split('\.')[1]));
        }

        function getUrlFragment(pattern) {
            var matcher = new RegExp(pattern + '=([^&]+)');
            var result = matcher.exec($location.path());
            if (result) {
                return result[1];
            }
        }

        publicApi.redirectToLoginPage=function(){
            configService.getConfig().then(function(config){
                $window.location.href=getRedirectUrl(config);
            })

        }

        publicApi.logout = function (){
            $window.sessionStorage.clear();
            configService.getConfig().then(function(config){
                $window.location.href=getLogoutUrl(config);
            });

        }

        publicApi.getUserPermissions = function () {
            return angular.fromJson($window.sessionStorage.getItem('userPermissions'));
        }

        $rootScope.$on('unauth-error',function() {
            modalService.show('Authorization Error','Authorization error. Your security session may have expired');
        });
        return publicApi;
    }
]);
