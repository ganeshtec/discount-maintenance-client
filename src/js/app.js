var app = angular.module('app', ['ngRoute','ngMaterial','ngCookies']);

app.config(function ($routeProvider,$locationProvider) {
    $routeProvider
        //.when('/promotion-admin', {template: ' ', controller: 'viewContextController'})
        .when('/promotion-admin', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/promotion-admin/:id', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/promotion-admin/compare/:promotionID1/:promotionID2', {templateUrl: 'compareView.html', controller: 'compareViewCtrl'})
        .when('/promotion-admin/clone/:cloneid', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/login', {templateUrl: 'login.html', controller: 'loginCtrl'})
        .when('/promotion-dashboard', {templateUrl: 'dashboardView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})
        
        .when('/promotion-digital', {templateUrl: 'digitalCreateFormView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})
        .when('/promotion-mfa', {templateUrl: 'mfaCreateFormView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})

        .otherwise({redirectTo: '/promotion-dashboard'});
          // use the HTML5 History API
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
});
app.run(function($rootScope, $cookies, $location) {
    $rootScope.$on('$locationChangeStart', function() {
        if (!($cookies.get('THDSSO'))) {
            $location.path('login');
        }
    });
});