var mainController = angular.module('MainController', []);

mainController.controller('MainCtrl', function($scope) {

	$scope.tagline = 'Main App Controller';	

})
.directive('mydirect', function() {
  return {
    template: 'Name: Test User Address: 123 4th St. Boston,MA'
  };
});