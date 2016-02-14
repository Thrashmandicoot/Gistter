(function() {
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
    vm.connectToTwitter = connectToTwitter;
    vm.signOut = signOut;

    activate();

    function activate() {
      checkIfReturningUser();
      twitterService.initialize();
    }

    function getLatestTweets() {
      return twitterService.getLatestTweets();
    }

    function refreshTimeline() {
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

      function findGists() {
        angular.forEach(vm.tweets, scanForGists);

        function scanTweets(tweet, i) {
          if (tweet.entities.urls[0])
            if (tweet.entities.urls[0].expanded_url.indexOf("github") > -1)
              captureGists();
        }

        function captureGists() {
          vm.findRepos(tweet.entities.urls[0].expanded_url);
          has_gist.push(tweet);
        }
      }
    };

    function findRepos(gists) {
      var username = gist.split('/')[3];
      var reposLength = vm.repos.length;

      if (reposLength === 0)
        getUserRepos(username);
      else
        tryAgain();

      function tryAgain() {
        var getOut = 0;
        angular.foreach(vm.repos, checkForUserRepos);

        if (getOut === 0)
          getUserRepos(username);

        function checkForUserRepos() {
          if (username === vm.repos[i])
            getOut += 1 &&
            break
        }
      }

    }

    function getUserRepos() {
      return twitterService.getUserRepos;
    }


    function connectToTwitter(){
      twitterService.connectTwitter(response)
        .then(connectToTwitterComplete)
        .catch(connectToTwitterFailed)

      function connectToTwitterComplete(response){
        if(twitterService.isReady()){
          $('#connectButton').fadeOut(function() {
            $('#getTimelineButton, #signOut').fadeIn();
            vm.connectedTwitter = true;
          });
        }
      }

      function connectToTwitterFailed(error){
        var errorMessage = "Unable to connect to Twitter"
        $log.error(errorMessage, error);
        alert(errorMessage);
      }
    }

    function signOut(){
      twitterService.clearCache();
      vm.tweets.length = 0;
      $('#getTimelineButton, #signOut').fadeOut(function() {
        $('#connectButton').fadeIn();
        vm.$apply(function() {
          vm.connectedTwitter = false;
        });
      });
    }

    function checkIfReturningUser(){
      if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        vm.connectedTwitter = true;
      }
    }
  }]);
