var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var posts = require('./api/services/posts');

// Use Express web app framework for routing
var app = express();

var botMode = true;

app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser());
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for posts

// route middleware that will happen on every request
app.use(function(req, res, next) {
  // continue doing what we were doing and go to the route
  next();
});

if (botMode) {
	console.log("Bot is activated");
	
    posts.stream(function (out) {
      console.log(out)
	})

	// retweet in every 5 minutes
	setInterval(function () {
		posts.stream(function(out) { 
		   console.log(out)	
		   }
	)}, 300000);

	// grab & retweet as soon as program is running...
    posts.retweet(function (out) {
      console.log(out)
	})
	
	// retweet in every 50 minutes
	setInterval(function () {
		posts.retweet(function(out) { 
		   //console.log(out)	
		   }
	)}, 3000000);

	// grab & 'favorite' as soon as program is running...
    posts.favoriteTweet(function (out) {
      console.log(out)
	})
	
	// 'favorite' a tweet in every 60 minutes
	setInterval(function () {
		posts.favoriteTweet(function(out) { 
		   //console.log(out)	
		   }
	)}, 3600000);
}

// Define application routes

//Sample Twitter REST API

// Create endpoint /posts for POST
app.post('/api/posts', function(req, res) {
  posts.createTweet(req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /posts for GET
app.get('/api/posts', function(req, res) {
  posts.getTweetsHard(function (out) {
    res.json(out)
  })
})

// Create endpoint /posts for GET
app.get('/api/posts2', function(req, res) {
  console.log(req.query);
  console.log(req.query.search);
  posts.getTweetsSoft(req.query.search, function (out) {
    res.json(out)
  })
})

// Create endpoint /posts/:post_id for GET
app.get('/api/posts/:postid', function(req, res) {
  posts.getPost(req.params.postid, function (out) {
    res.json(out)
  })
})

//Create Http Server to listen for requests to routes
var server = app.listen(4000, function () {
  console.log('Listening on port', server.address().port)
})

module.exports = app;
