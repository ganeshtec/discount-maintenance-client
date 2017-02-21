app.service('loginService', ['$http', '$q', '$cookies', '$location', '$timeout', 'DataFactory','URL_CONFIG',
    function($http, $q, $cookies, $location, $timeout, DataFactory,URL_CONFIG) {
        var publicApi = {};
        var status = null;
        var urls = new URL_CONFIG();

        publicApi.getErrorStatus = function() {
            return status;
        }


        publicApi.setErrorStatus = function(errstatus) {
            status = errstatus;
        }

        // Method to deactivate all sections, expected to have property .isActive
        publicApi.authenticate = function(name, password) {
            var payLoad = { "userName": name, "password": password };
            var deferred = $q.defer();
            return $http({
                method: 'POST',
                url: urls.serviceUrl + '/security/validateUserCreds.json',
                cache: false,
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

                data: payLoad
            }).then(httpSuccess, httpError);

            function httpSuccess(response, status, headers) {
                if (response.data == null || response.data == undefined || response.data == '') {
                    $cookies.remove('THDSSO', { 'domain': '.homedepot.com' });
                    $cookies.remove('userName', { 'domain': '.homedepot.com' });

                    status = 'invaliduser';

                } else {
                    var data = response.data;
                    var THDSSO = data.ssoCookie;
                    var username = data.userName;
                    var resstatus = data.status;
                    if (THDSSO == null || THDSSO == 'null' || resstatus == 'INVALID_CREDENTIALS' || resstatus == 'PASSWORD_EXPIRED') {
                        $cookies.remove('THDSSO', { 'domain': '.homedepot.com' });
                        $cookies.remove('userName', { 'domain': '.homedepot.com' });

                        status = 'invaliduser';

                        $location.path("login");

                    } else {
                    	console.log("___Control inside else loop____");		
                        $cookies.put('THDSSO', THDSSO, { 'domain': '.homedepot.com' });
                        $cookies.put('userName', username, { 'domain': '.homedepot.com' });
                        status = "";
                        //deferred.resolve({ message: 'Success' });
                        redirectPage();
                        publicApi.authorizeUser(username,'login');
                    }

                }
                return status;
            }

            function httpError(response) {
                if (response.status === '403') {
                    status = 'unauthorized';

                } else {
                    status = response.statusText;


                }
                return status;
            }

            function redirectPage() {
                status = "";
                $location.path("promotion-dashboard");
            }

        }

        // Method to deactivate all sections, expected to have property .isActive
        publicApi.sessionValidate = function(ssoCookie,sourcepage) {
           
            if (ssoCookie == null || ssoCookie == 'null') {
                status = 'invalidsession';

                redirectPage();
            }

            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: urls.serviceUrl + '/security/isSessionValid.json?thdsso=' + ssoCookie,
                cache: false,
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },


            }).then(httpSuccess, httpError);

            function httpSuccess(response, status, headers) {
               
                if (response.data == null || response.data == undefined || response.data == '') {
                    $cookies.remove('THDSSO',{'domain': '.homedepot.com'});
                    $cookies.remove('userName',{'domain': '.homedepot.com'});
            
                    status = 'invaliduser';
                    $location.path("login");

                } else {
                    var data = response.data;
                    if (data.valid != 'true') {
                        status = 'invalidsession';
                        redirectPage();
                    } else {
                        status = 'success';
                        //publicApi.authorizeUser($cookies.get('userName'),sourcepage);
                         if( sourcepage === 'login') {
                              $location.path("promotion-dashboard");
                         }
                         
                    }

                }
            }

            function httpError(response) {                 
                if (response.status === '403') {
                    status = 'unauthorized';

                } else {
                    status = response.statusText;

                }
                 redirectPage();
            }

            function redirectPage() {
                status = 'invalidsession';
                $location.path("login");
            }

        }


        // Method to check user has authorization to see the applicaiton
        publicApi.authorizeUser = function(username,sourcepage) {
            

            var deferred = $q.defer();
             $http({
                method: 'GET',
                url:  urls.authorizeUrl + username +'.json',
                cache: false,
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },


            }).then(httpSuccess, httpError);

            function httpSuccess(response, status, headers) {

                if (response.data == null || response.data == undefined || response.data == '') {
                  status = 'unauthorized';
                    redirectPage();

                } else {
                   
                    
                     var data = response.data;
                    if (data.length === 0) {
                        status = 'unauthorized';
                        redirectPage();
                    } else {
                        status = 'success';
                        if( sourcepage === 'login') {
                             $location.path("promotion-dashboard");
                        }
                        
                         
                    }
                 
                }
            }

            function httpError(response) {
                
                if (response.status === '403') {
                    status = 'unauthorized';
                     

                } else {
                    status = response.statusText;

                }
                redirectPage();
            }

            function redirectPage() {
                status = 'unauthorized';
                 $cookies.remove('THDSSO', { 'domain': '.homedepot.com' });
                 $cookies.remove('userName', { 'domain': '.homedepot.com' });                
                $location.path("login");
            }

            function parseXml(xmlStr) {
                var parseXml;
                var xmlDoc;


                if (typeof window.DOMParser != "undefined") {



                    xmlDoc = (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
                    xmlDoc.async = "false";

                    return xmlDoc;



                } else if (typeof window.ActiveXObject != "undefined" &&
                    new window.ActiveXObject("Microsoft.XMLDOM")) {

                    parseXml = function(xmlStr) {
                        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = "false";
                        xmlDoc.loadXML(xmlStr);
                        return xmlDoc;
                    };
                } else {

                    throw new Error("No XML parser found");
                }
                return null

            }

            function validateXml(xmlDoc) {
                
                var permissionObjId = xmlDoc.getElementsByTagName("id");
                for (var i = 0; i < permissionObjId.length; i++) {
                    var childPermissionId = xmlDoc.getElementsByTagName("id")[i].childNodes[0].nodeValue;
                    if (childPermissionId == 145) {
                        return true;
                    }
                }
                return false;
             
            }


        }

        return publicApi;

    }]);