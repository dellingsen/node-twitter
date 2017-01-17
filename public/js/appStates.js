angular.module('appStates').config(['$stateProvider', function($stateProvider) {

  $stateProvider

      .state('posts', {
        url:'/posts',
        templateUrl: 'views/post.html',
        controller: 'PostController',
        authenticate: true
      })
  }]);