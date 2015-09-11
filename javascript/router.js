angular.module('Gistter')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider

    .when('/tweets', {
      controller: 'TwitterController',
      templateUrl: 'templates/index/tweets.html'
    })
    .when('/repos', {
      controller: 'TwitterController',
      templateUrl: 'templates/index/repos.html'
    })
    .otherwise('/tweets', {
      controller: 'TwitterController',
      templateUrl: 'templates/index/tweets.html'
    });

}]);
