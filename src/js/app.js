var app = angular.module('app', ['ngRoute','ngMaterial','ngCookies']);
app.config(function ($routeProvider,$locationProvider) {
    $routeProvider
        .when('/discount-admin', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/discount-admin/:id', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/discount-admin/compare/:promotionID1/:promotionID2', {templateUrl: 'compareView.html', controller: 'compareViewCtrl'})
        .when('/discount-admin/clone/:cloneid', {templateUrl: 'promotionAdmin.html', controller: 'promotionAdminCtrl'})
        .when('/error',{templateUrl: 'error.html'})
        .when('/discount-dashboard', {templateUrl: 'dashboardView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})
        .when('/promotion-digital', {templateUrl: 'digitalCreateFormView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})
        .when('/promotion-mfa', {templateUrl: 'mfaCreateFormView.html',reloadOnSearch:false, controller: 'DashboardCtrl'})
        .otherwise({redirectTo: '/discount-dashboard'});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
});
app.run(function($rootScope, $location, loginService) {
    $rootScope.$on('$locationChangeStart', function(/*event, next, current*/) {
        loginService.intercept();
    });
});
