var postService = angular.module('PostService',[]);

postService.factory('PostSrv', ['$http', '$rootScope', function($http, $rootScope) {

  return {
    // call to get all posts
    // $http is an AngularJS (AJAX) service for reading data from remote servers.
    // $http.get() reads JSON data from the specified URL
    getAll : function() {
      console.log('In PostService: GET /posts ')
      return $http.get('/api/posts');
    },

    getAll2 : function(searchArray) {
      console.log('In PostService: GET /posts ')
      return $http.get('/api/posts2', {params: { "search[]": searchArray }});
    },

    // call to DELETE a posts
    get : function(id) {
      return $http.get('/api/posts/' + id);
    },

    // call to DELETE a posts
    update : function(id) {
      return $http.put('/api/posts/' + id, postData);
    },

    // call to POST and create a new posts
    create : function(userData) {
      return $http.post('/api/posts', postData);
    },

    // call to DELETE a posts
    delete : function(id) {
      return $http.delete('/api/posts/' + id);
    }
  }


}]);