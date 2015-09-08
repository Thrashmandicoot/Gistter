angular.module('Gistter')

.config([$routeProvider, function($routeProvider) {
  $routeProvider

    .when('/', {
      controller: 'IndexController',
      templateUrl: 'templates/index/index.html'
    });

}]);
