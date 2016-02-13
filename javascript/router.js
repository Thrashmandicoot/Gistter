(function () {
  'use strict';

  angular
    .module('Gistter')
    .config(GistterRoutes);

    GistterRoutes.$inject = ['$routeProvider'];

    function GistterRoutes($routeProvider) {
      $routeProvider
        .when('/tweets', {
          controller: 'GistterController',
          templateUrl: 'templates/index/tweets.html'
        })
        .when('/repos', {
          controller: 'GistterController',
          templateUrl: 'templates/index/repos.html'
        })
        .otherwise('/tweets', {
          controller: 'GistterController',
          templateUrl: 'templates/index/tweets.html'
      });
    }
})();
