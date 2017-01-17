var postController = angular.module('PostController', []);

// The PostController function is a standard JavaScript object constructor.
// AngularJS will invoke PostController with a $scope and PostSrv object
// The scope is the binding part between the HTML (view) and the JavaScript (controller)
// $scope object holds all application variables and functions
// Note: Use an array of Strings so Angular can resolve dependencies...
postController.controller('PostCtrl', ['$scope', '$location', 'PostSrv', function($scope, $location, PostSrv)
{
  console.log('In PostController')

  $scope.postMap = {};
  $scope.detailPost = {};
  $scope.showList = false;
  $scope.showDetail = false;
  $scope.searchWords = "";
  
  PostSrv.getAll().success(function(data)
  {
	console.log("getAll()");
	
    // Create postList property on the Application $scope object
    $scope.postList = data;
    $scope.postSize = data.length;
	
	for (var i=0; i<data.length; i++) {
		$scope.postMap[data[i].id] = data[i];
	}
	
	$scope.showList = true;
	
  }).
  error(function(data, status) {
    console.log('PostController:Error');
    console.log(data);
    $scope.errorMsg = {message: 'Error: no posts were found.'};
  });

  $scope.showPostDetails = function(postid) {
	  console.log("Post details for id: " + postid);
	  $scope.detailPost = $scope.postMap[postid];
  	  $scope.showList = false;
	  $scope.showDetail = true;
  }
  
  $scope.updatePost = function(postid) {
	  console.log("Post details for id: " + postid);
  	  var postEntry = { title: $scope.title, content: $scope.content, type: 'post', status: 'Publish' };

	  console.log('Post Entry object:')
	  console.log(postEntry)

	  /*
	  PostSrv.update(postid, postEntry).success(function(data)
	  {
		  console.log('AddPostController:Save Success');
		  console.log(data);
		  $location.path('/posts');
	  }).
	  error(function(data, status) {
		  console.log('AddPostController:Error');
		  console.log(data);
		  $scope.errorMsg = {message: 'Error: could not create post'};
	  });
	  */
	  
  	  $scope.showList = true;
	  $scope.showDetail = false;
  }

  $scope.showPostList = function() {
  	  $scope.showList = true;
	  $scope.showDetail = false;
  }

  $scope.searchTweets = function() {
	console.log("searchWords:")
	console.log($scope.searchWords);
	var searchArray = $scope.searchWords.split(',');
	console.log(searchArray);

	  PostSrv.getAll2(searchArray).success(function(data)
	  {
		console.log("getAll2(search)");
		
		// Create postList property on the Application $scope object
		$scope.postList = data;
		$scope.postSize = data.length;
		
		for (var i=0; i<data.length; i++) {
			$scope.postMap[data[i].id] = data[i];
		}
		
		$scope.showList = true;
		
	  }).
	  error(function(data, status) {
		console.log('PostController:Error');
		console.log(data);
		$scope.errorMsg = {message: 'Error: no posts were found.'};
	  });
  }

}])


postController.controller('AddPostController', function($scope, $location, PostSrv)
{
  console.log('In AddPostController....calling PostService now.')

  $scope.save = function() {
    console.log('Form data for post info')
    console.log($scope.post)
    console.log($scope.title)
    console.log($scope.content)

    var postEntry = { title: $scope.title, content: $scope.content, type: 'post', status: 'Publish' };

    console.log('Post Entry object:')
    console.log(postEntry)

    PostSrv.create(postEntry).success(function(data)
    {
      console.log('AddPostController:Save Success');
      console.log(data);
      $location.path('/posts');
    }).
    error(function(data, status) {
      console.log('AddPostController:Error');
      console.log(data);
      $scope.errorMsg = {message: 'Error: could not create post'};
    });

  }

})