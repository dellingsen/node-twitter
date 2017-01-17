angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

	// home page
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainCtrl',
        loginRequired: true //
    })
	.when('/posts', {
	  templateUrl: 'views/post.html',
	  controller: 'PostCtrl',
      loginRequired: true //
    })
    .when('/editpost', {
      templateUrl: 'views/editpost.html',
      controller: 'PostCtrl',
      loginRequired: true //
    })
    .when('/addpost', {
      templateUrl: 'views/addpost.html',
      controller: 'AddPostController',
      loginRequired: true //
    })
    .otherwise({redirectTo: '/'})

  $locationProvider.html5Mode(true);

}]);