(function(){
  'use strict';

  angular
    .module('Gistter')
    .controller('TwitterController', twitterController);

    twitterController.$inject = ['$q', 'twitterHandlerService'];

    function twitterController($q, twitterHandlerService) {
      var vm = this;
      vm.tweets = [];
      vm.repos = [];

      vm.refreshTimeline = refreshTimeline;
      vm.findRepos = findRepos;

      activate();

      function activate(){
        twitterService.initialize();
      }

      function getLatestTweets(){
        return twitterService.getLatestTweets();
      }

      function refreshTimeline(){
        var has_gist = [];
        var data = getLatestTweets();

        if (data.length === 0)
          return vm.noTweetsError = true;

        vm.tweets = vm.tweets.concat(data);
            // go through each tweet and find gists
        findGists();
        vm.tweets = has_gist;
        if (vm.tweets.length < 1)
          return vm.noTweetsError = true

        function findGists(){
          angular.forEach(vm.tweets, scanForGists);

          function scanTweets(tweet, i) {
            if (tweet.entities.urls[0])
              if (tweet.entities.urls[0].expanded_url.indexOf("github") > -1)
                captureGists();
          }

          function captureGists(){
            vm.findRepos(tweet.entities.urls[0].expanded_url);
            has_gist.push(tweet);
          }
        }
      };

      function findRepos(gists){
        var username = gist.split('/')[3];
        var reposLength = vm.repos.length;

        if(reposLength === 0)
          getUserRepos(username);
        else
          tryAgain();

        function tryAgain(){
          var getOut = 0;
          angular.foreach(vm.repos, checkForUserRepos);

          if(getOut === 0)
            getUserRepos(username);

          function checkForUserRepos(){
            if(username === vm.repos[i])
              getOut += 1 && break
          }
        }

      }

      function getUserRepos(){
        return twitterService.getUserRepos;
      }



  //when the user clicks the connect twitter button, the popup authorization window opens
  vm.connectButton = function() {
    twitterService.connectTwitter().then(function() {
      if (twitterService.isReady()) {
        //if the authorization is successful, hide the connect button and display the tweets
        $('#connectButton').fadeOut(function() {
          $('#getTimelineButton, #signOut').fadeIn();
          vm.connectedTwitter = true;
        });
      } else {
        alert("We could not connect you successfully.");
      }
    });
  };

  //sign out clears the OAuth cache, the user will have to reauthenticate when returning
  vm.signOut = function() {
    twitterService.clearCache();
    vm.tweets.length = 0;
    $('#getTimelineButton, #signOut').fadeOut(function() {
      $('#connectButton').fadeIn();
      vm.$apply(function() {
        vm.connectedTwitter = false;
      });
    });
  };

  //if the user is a returning user, hide the sign in button and display the tweets
  if (twitterService.isReady()) {
    $('#connectButton').hide();
    $('#getTimelineButton, #signOut').show();
    vm.connectedTwitter = true;
  }
}]);
