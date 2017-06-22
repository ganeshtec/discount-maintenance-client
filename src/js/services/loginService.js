app.service('loginService', ['$http', '$q', '$cookies', '$location', '$timeout', 'DataFactory', 'URL_CONFIG',
    function ($http, $q, $cookies, $location, $timeout, DataFactory, URL_CONFIG) {
        var publicApi = {};
        var status = null;
        var urls = new URL_CONFIG();
        var userPermissions = null;

        publicApi.getErrorStatus = function () {
            return status;
        }


        publicApi.setErrorStatus = function (errstatus) {
            status = errstatus;
        }

        // Method to deactivate all sections, expected to have property .isActive
        publicApi.authenticate = function (name, password) {
            var payLoad = {
                'userName': name,
                'password': password
            };
            return $http({
                method: 'POST',
                url: urls.serviceUrl + '/security/validateUserCreds.json',
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: payLoad
            }).then(httpSuccess, httpError);

            function httpSuccess(response, status) {
                if (response.data == null || response.data == undefined || response.data == '') {
                    $cookies.remove('THDSSO', {
                        'domain': '.homedepot.com'
                    });
                    $cookies.remove('userName', {
                        'domain': '.homedepot.com'
                    });
                    $cookies.remove('userPermissions', {
                        'domain': '.homedepot.com'
                    });

                    status = 'invaliduser';

                } else {
                    var data = response.data;
                    var THDSSO = data.ssoCookie;
                    var username = data.userName;
                    var resstatus = data.status;
                    if (THDSSO == null || THDSSO == 'null' || resstatus == 'INVALID_CREDENTIALS' || resstatus == 'PASSWORD_EXPIRED') {
                        $cookies.remove('THDSSO', {
                            'domain': '.homedepot.com'
                        });
                        $cookies.remove('userName', {
                            'domain': '.homedepot.com'
                        });
                        $cookies.remove('userPermissions', {
                            'domain': '.homedepot.com'
                        });

                        status = 'invaliduser';

                        $location.path('login');

                    } else {

                        $cookies.put('THDSSO', THDSSO, {
                            'domain': '.homedepot.com'
                        });
                        $cookies.put('userName', username, {
                            'domain': '.homedepot.com'
                        });
                        status = '';
                        redirectPage();
                        publicApi.authorizeUser(username, 'login');
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
                status = '';
                $location.path('discount-dashboard');
            }

        }

        // Method to deactivate all sections, expected to have property .isActive
        publicApi.sessionValidate = function (ssoCookie, sourcepage) {

            if (ssoCookie == null || ssoCookie == 'null') {
                status = 'invalidsession';

                redirectPage();
            }

            $http({
                method: 'GET',
                url: urls.serviceUrl + '/security/isSessionValid.json?thdsso=' + ssoCookie,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },


            }).then(httpSuccess, httpError);

            function httpSuccess(response) {

                if (response.data == null || response.data == undefined || response.data == '') {
                    $cookies.remove('THDSSO', {
                        'domain': '.homedepot.com'
                    });
                    $cookies.remove('userName', {
                        'domain': '.homedepot.com'
                    });
                    $cookies.remove('userPermissions', {
                        'domain': '.homedepot.com'
                    });

                    status = 'invaliduser';
                    $location.path('login');

                } else {
                    var data = response.data;
                    if (data.valid != 'true') {
                        status = 'invalidsession';
                        redirectPage();
                    } else {
                        status = 'success';
                        if (sourcepage === 'login') {
                            $location.path('discount-dashboard');
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
                $location.path('login');
            }

        }

        publicApi.getUserPermissions = function () {
            return userPermissions;
        }

        publicApi.authorizeUser = function (username, sourcepage) {
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

                if (response.data == null || response.data == undefined || response.data == '') {
                    status = 'unauthorized';
                    redirectPage();

                } else {


                    var data = response.data;
                    if (data.length === 0) {
                        status = 'unauthorized';
                        redirectPage();

                    } else {
                        userPermissions = data;
                        $cookies.put('userPermissions', JSON.stringify(userPermissions));
                        status = 'success';
                        if (sourcepage === 'login') {
                            $location.path('discount-dashboard');
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
                $cookies.remove('THDSSO', {
                    'domain': '.homedepot.com'
                });
                $cookies.remove('userName', {
                    'domain': '.homedepot.com'
                });
                $cookies.remove('userPermissions', {
                    'domain': '.homedepot.com'
                });
                $location.path('login');
            }
        }
        return publicApi;
    }
]);
