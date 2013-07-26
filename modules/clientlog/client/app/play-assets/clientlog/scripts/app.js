'use strict';

angular.module('app', ['app.controllers', 'app.directives'])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'logs/assets/clientlog/views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
