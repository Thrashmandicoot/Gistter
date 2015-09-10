angular.module('Gistter')

.config([$routeProvider, function($routeProvider) {
  $routeProvider

    .when('/', {
      controller: 'TwitterController',
      templateUrl: 'templates/index/index.html'
    });

}]);
