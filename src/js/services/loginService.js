app.service('loginService', ['$http', '$location', 'URL_CONFIG','$rootScope','$window','configService','modalService',
    function ($http, $location, URL_CONFIG, $rootScope,$window,configService,modalService) {
        var publicApi = {};
        var urls = new URL_CONFIG();
        var userPermissions = null;
        var userInfo = null;
        var userName = null;
        var currentUserRole=null;
        function getRedirectUrl(config) {
            return config.oAuthAuthorizationUrl + '?client_id='+config.appId
            + '&response_type=token&redirect_uri='+urls.dashboardUiUrl+'/';
        }
        function getLogoutUrl(config){
            return config.oAuthLogoutUrl+'?client_id='+config.appId;
        }

        publicApi.getUserInfo =function(){
            return userInfo;
        }

        publicApi.getUserName = function(){
            return userName;
        }

        publicApi.getCurrentUserRole = function(){
            return currentUserRole;
        }

        publicApi.setCurrentUserRole = function(userRole){
            currentUserRole=parseInt(userRole);
        }

        publicApi.intercept =function(){
            var accessToken=getUrlFragment('access_token');
            if(accessToken!=null){
                userInfo={};
                userInfo.accessToken=accessToken;
                userInfo.accessTokenDetails=decodeToken(accessToken);
                userName=userInfo.accessTokenDetails.user_name;
                authorizeUser(userInfo.accessTokenDetails.user_name);
            }else if(!userInfo || Date.now()>userInfo.accessTokenDetails.exp*1000){
                this.redirectToLoginPage();
            }
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
            configService.getConfig().then(function(config){
                $window.location.href=getLogoutUrl(config);
            });

        }

        publicApi.getUserPermissions = function () {
            return userPermissions;
        }

        function authorizeUser (username) {
            $http({
                method: 'GET',
                url: urls.authorizeUrl + username + '.json',
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(httpSuccess, httpError);
            function httpSuccess(response) {
                if (response.data == null || response.data == undefined || response.data == ''|| response.data.length == 0) {
                    showError('Authorization Error','You are not authorized to use this application');
                } else {
                    // var userPermValue =   [{id:'228', description:'SKU: Discount Engine-Store MFA'} ,{id:'229', description:'SKU: Discount Engine-Online DCM'}];
                    // userPermissions = userPermValue; // (for testing)

                    userPermissions = response.data;

                    //Set default user permission based on the first shortDesc alphabeticly
                    var defaultPerm = -1;
                    //Set shortDesc and defulat user permission
                    for(var i = 0; i < userPermissions.length; i++){
                        var userPerm = userPermissions[i].description;
                        var n = userPerm.indexOf('-');
                        userPermissions[i].shortDesc = userPerm.substring(n+1);

                        if(defaultPerm < 0) {
                            defaultPerm = i;
                        }else if (userPermissions[i].shortDesc < userPermissions[defaultPerm].shortDesc){
                            defaultPerm = i;
                        }
                    }
                    publicApi.setCurrentUserRole(userPermissions[defaultPerm].id);
                    $rootScope.$broadcast('user-login');
                }
            }

            function httpError() {
                showError('System Error','Error retrieving user information');
            }

            function showError(title,errorMessage) {
                modalService.showAlert(title,errorMessage);
            }
        }

        $rootScope.$on('unauth-error',function() {
            modalService.show('Authorization Error','Authorization error. Your security session may have expired');
        });
        return publicApi;
    }
]);
