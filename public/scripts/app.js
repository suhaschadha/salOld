'use strict';

angular.module('LOCUseCase', ['ngStorage','ngRoute','ngAnimate','angular-loading-bar','ui.bootstrap','chart.js'])
.config(['$routeProvider', '$httpProvider','$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
        when('/signin', {
            templateUrl: 'partials/signin1.html',
            controller: 'SigninController'
        }).
        when('/profile', {
            templateUrl: 'partials/UserProfile.html',
            controller: 'UserProfileController'
        }).
        when('/roles', {
            templateUrl: 'partials/roles.html',
            controller: 'rolesController'
        }).
        when('/3pl', {
            templateUrl: 'partials/3pl.html',
            controller: '3plController'
        }).
        when('/3pllanding', {
            templateUrl: 'partials/3pllanding.html',
            controller: '3pllandingController'
        }).
        when('/supplier', {
            templateUrl: 'partials/supplier.html',
            controller: 'supplierController'
        }).
        when('/supplierlanding', {
            templateUrl: 'partials/supplierlanding.html',
            controller: 'supplierlandingController'
        }).
        when('/manufacturer', {
            templateUrl: 'partials/manufacturer.html',
            controller: 'manufacturerController'
        }).
        when('/blockchaintracking', {
            templateUrl: 'partials/blockchaintracking.html',
            controller: 'blockchaintrackingController'
        }).                
        when('/transitsupplier', {
            templateUrl: 'partials/transitsupplier.html',
            controller: 'supplierController'
        }).
        when('/tabb', {
            templateUrl: 'partials/tab.html',
            controller: '3plController'
        }).
        when('/test', {
            templateUrl: 'partials/test.html',
            controller: 'TestController'
        }).
        otherwise({
            redirectTo: '/signin'
        });
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
}

])
.run(['$rootScope',function($rootScope){
$rootScope.showflag = false;
}
]);
