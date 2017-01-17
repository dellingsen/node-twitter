// AngularJS dependency injection - inject defined application modules into our app
var app = angular.module('meanApp', ['ngRoute', 'appRoutes', 'MainController', 'PostController', 'PostService']);

app.run(function($rootScope, $location, $http) {
});