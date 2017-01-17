var twit = require('twit');
var config = require('./../../config.js');

var Twitter = new twit(config.twitter);

// find latest tweet according the query 'q' in params
exports.getTweetsSoft = function(paramArray, callback) {
	var searchParams = '';
	for (var i=0; i<paramArray.length; i++) {
		searchParams += paramArray[i] + ",";
	}
	
    var params = {
        q: searchParams,  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
	
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // return tweets
		  console.log(data)
          callback(data.statuses);
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
		  console.log(err)
		  callback(err);
        }
    });
}

exports.getTweetsHard = function(callback) {
    var params = {
        q: '#MNHockey, #MNWild',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // return tweets
		  console.log(data)
          callback(data.statuses);
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
		  console.log(err)
		  callback(err);
        }
    });
}

exports.stream = function(callback) 
{
	console.log("Looking for tweets by location or keywords")
	// A user stream
	//var stream = Twitter.stream('user');
	//var stream = Twitter.stream('public');
	//var stream = Twitter.stream('site');
	var sanfran = [ '-122.75', '36.8', '-121.75', '37.8' ]
	var minneapolis = [ '-93.26', '45.0', '-92.26', '46.0' ]
	var stream = Twitter.stream('statuses/filter', { track: "nodejs" })

	// When someone follows the user
	// In this callback we can see the name and screen name
	//stream.on('follow', followEvent);
	stream.on('tweet', tweetEvent);
	
	// A geo location
	//stream.on('tweet', tweetEvent);
	
}

function followEvent(event) {

  var name = event.source.name;
  var screenName = event.source.screen_name;
  console.log("followEvent");
  console.log('I was followed by: ' + name + ' ' + screenName);
  
  // post back tweet to that user
  Twitter.post('statuses/update', { status: "@"+screenName + " thanks for the follow!" }, 
	function(err, response) {
		if (response) {
			console.log('Tweeted!!!');
		}
		// if there was an error while tweeting
		if (err) {
			console.log('Something went wrong while TWEETING...');
			console.log(err)
		}
  });
	
}

function tweetEvent(tweet) {
	
    var reply_to = tweet.in_reply_to_screen_name;
    // Check to see if this was, in fact, a reply to you
	var date = tweet.created_at;
    var name = tweet.user.name;
    var location = tweet.user.location;
    var screenname = tweet.user.screen_name;
    var tweetText = tweet.text;
    console.log("tweetEvent - date: " + date);
    console.log("tweetEvent - name: " + name);
    console.log("tweetEvent - screenname: " + screenname);
    console.log("tweetEvent - location: " + location);
    console.log("tweetEvent - text: " + tweetText);


	var params = {screen_name: screenname};
	Twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
		console.log("TIMELINE TWEETS:");
		console.log(tweets.length);
		if (tweets[0].retweeted_status) {
			console.log("Retweeted timeline user location:")
			console.log(tweets[0].retweeted_status.user.location);
		}
	  }
	});

  
}

exports.retweet = function(callback) {
    var params = {
        q: '#angularjs, #nodejs',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err && data.statuses.length > 0) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
					callback(response)
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
					callback(err)
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Didnt find any tweets to retweet');
        }
    });
}


// find a random tweet and 'favorite' it
exports.favoriteTweet = function(callback) {
  var params = {
      q: '#whyhim, #apeassassin',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
		  callback(err)
        }
        else{
          console.log('FAVORITED... Success!!!');
		  callback(data)
        }
      });
    }
  });
}

// create Tweet
exports.createTweet = function(body, callback) {

    var tweet = body.status;
	
	Twitter.post('statuses/update', { status: tweet }, function(err, response) {
		if (response) {
			console.log('Tweeted!!!');
		}
		// if there was an error while tweeting
		if (err) {
			console.log('Something went wrong while TWEETING...');
			console.log(err)
		}
	});

}

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};
