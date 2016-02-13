(function () {
  'use strict';

  angular
    .module('Gistter.services')
    .factory('twitterService', twitterService);

    twitterService.$inject = ['$q'];

    function twitterService($q) {
      var authorizationResult = false;

      var services = {
        initialize : initialize,
        isReady : isReady,
        connectTwitter : connectTwitter,
        clearCache : clearCache,
        getLatestTweets : getLatestTweets
      }
      return services

      function initialize(){
        var oAuthSettings = { cache: true }
        OAuth.initialize('aPN6TnBWF7isEd2atAUftS3UbOg', oAuthSettings);

        authorizationResult = OAuth.create('twitter');
      }

      function isReady(){
        return (authorizationResult);
      }

      function connectTwitter(){
        return Oauth.popup('twitter')
          .then(connectTwitterComplete)
          .catch(connectTwitterFailed);

        function connectTwitterComplete(response){
          authorizationResult = result;
          return response.data;
        }

        function connectTwitterFailed(error){
          $log.error('XHR failed for connectTwitter.', error.data);
          alert('We were unable to log you in.');
        }
      }

      function getLatestTweets(){
        return authorizationResult.get('/1.1/statuses/home_timeline.json?count=200')
          .then(getLatestTweetsComplete)
          .catch(getLatestTweetsFailed);

        function getLatestTweetsComplete(response){
          return response.data;
        }

        function getLatestTweetsFailed(error){
          $log.error('XHR failed for getLatestTweets.', error.data);
        }
      }

      function clearCache(){
        OAuth.clearCache('twitter');
        authorizationResult = false;
      }
})();
