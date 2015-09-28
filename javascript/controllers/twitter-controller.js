angular.module('Gistter')

.controller('TwitterController', function($scope, $q, twitterService, $http) {
  $scope.tweets = [];
  $scope.repos = [];

  twitterService.initialize();

  // using the OAuth authorization result get the latest 20+ tweets from twitter for the user
  $scope.refreshTimeline = function(maxId) {
    var has_gist = [];
    twitterService.getLatestTweets(maxId).then(function(data) {
      $scope.tweets = $scope.tweets.concat(data);
      // go through each tweet and find gists
      angular.forEach($scope.tweets, function(tweet, i) {
        if (tweet.entities.urls[0]) {
          if (tweet.entities.urls[0].expanded_url.indexOf("github") > -1) {
            $scope.findRepos(tweet.entities.urls[0].expanded_url);
            has_gist.push(tweet);
          }
        }
      });
      $scope.tweets = has_gist;
    });
  };
  // Query tweet that contains gist for git user's repos
  $scope.findRepos = function(gist) {
    var username = gist.split('/')[3];

    if ($scope.repos.length === 0) {
      getUserRepos(username);
    } else {
      // make sure usernmae doesn't exist
      var getOut = 0;
      for(var i; i < $scope.repos.length ;i++){
        if (username === $scope.repos[i]) {
          getOut++;
          break;
        }
      }
      if (getOut === 0) {
        getUserRepos(username);
      }
    }
  };

  var getUserRepos = function(username){
    $http.get("https://api.github.com/users/" + username + "/repos")
      .then(onRepos, onError);
  };

  var onRepos = function(response) {
    $scope.repos.push(response.data);
  };

  var onError = function(reason) {
    $scope.error = "Could not fetch the data";
  };

  //when the user clicks the connect twitter button, the popup authorization window opens
  $scope.connectButton = function() {
    twitterService.connectTwitter().then(function() {
      if (twitterService.isReady()) {
        //if the authorization is successful, hide the connect button and display the tweets
        $('#connectButton').fadeOut(function() {
          $('#getTimelineButton, #signOut').fadeIn();
          $scope.refreshTimeline();
          $scope.connectedTwitter = true;
        });
      } else {
        alert("We could not connect you successfully.");
      }
    });
  };

  //sign out clears the OAuth cache, the user will have to reauthenticate when returning
  $scope.signOut = function() {
    twitterService.clearCache();
    $scope.tweets.length = 0;
    $('#getTimelineButton, #signOut').fadeOut(function() {
      $('#connectButton').fadeIn();
      $scope.$apply(function() {
        $scope.connectedTwitter = false;
      });
    });
  };

  //if the user is a returning user, hide the sign in button and display the tweets
  if (twitterService.isReady()) {
    $('#connectButton').hide();
    $('#getTimelineButton, #signOut').show();
    $scope.connectedTwitter = true;
    $scope.refreshTimeline();
  }
});
