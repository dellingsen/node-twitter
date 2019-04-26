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

// This is what the res.locals object is for. Setting variables directly on the request object is not supported or documented. 
// res.locals is guaranteed to hold state over the life of a request.
// route middleware that will happen on every request

app.use(function(req, res, next) {
  // continue doing what we were doing and go to the route
  // how to pass variables to next middleware
  // res.locals.user = req.user;  
  next();
});

if (botMode)
{
  console.log("Bot is activated");

  posts.stream(function (out) {
      console.log(out)
  })

  // search tweets every 5 seconds
  setInterval(function () {
    posts.stream(function(out) {
      console.log(out)
   }
  )}, 5000);

}


//Define application routes
//Twitter REST API

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


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
})

//Create Http Server to listen for requests to routes
let server = app.listen(45000, function () {
  console.log('Listening on port', server.address().port)
})

server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    console.error('Connection was reset!?!?');
    console.error(error);
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    case 'ECONNRESET':
      console.error(bind + ' connection was reset!?!?');
      console.error(error);
      //process.exit(1);
      break;
    default:
      console.error('Default error condition was captured:');
      console.error(error);
      //throw error;
  }
}

module.exports = app;
