var twit = require('twit');
var config = require('./../../config.js');

var Twitter = new twit(config.twitter);

// Called via automated Bot when server starts
exports.stream = function(callback)
{
	//console.log("stream is on - filtering tweets by location...")
	// A user stream
	//let stream = Twitter.stream('user');
	//let stream = Twitter.stream('public');
	//let stream = Twitter.stream('site');

	//bbox = left,bottom,right,top
	//bbox = min Longitude , min Latitude , max Longitude , max Latitude
	//http://bboxfinder.com
        //For example track=twitter&locations=-122.75,36.8,-121.75,37.8 would match any Tweets containing the term Twitter (even non-geo Tweets) 

	let sanfran = [ '-122.75', '36.8', '-121.75', '37.8' ]
	let minneapolis = [ '-93.26', '45.0', '-92.26', '46.0' ]
	let melbourneBeach = [ '-80.572958', '28.017742', '-80.426788' ,'28.076297' ]
	//http://boundingbox.klokantech.com/ (broader area)
	let capeToVeroBeach = [ '-80.6354', '27.7019', '-80.3622', '28.5169']
        let jacksonvilleToMiami = [-81.4519,25.721,-79.8589,30.656];
        let daytonaToLauderdale = ['-81.1237', '26.0488', '-79.9042', '29.5658'];
        let florida = ['-84.6', '24.24', '-79.44', '30.69'];

	//let stream = Twitter.stream('statuses/filter', {'locations': minneapolis})
	//Twitter API only uses OR condition, so you need to manually track keywords from location
	//let stream = Twitter.stream('statuses/filter', { 'locations': daytonaToLauderdale, track: ["#shark","shark"] })
	//like this...
	let filterStream = Twitter.stream('statuses/filter', { 'locations': florida})
	//send results to tweetEvent() function
	filterStream.on('tweet', tweetEvent);

	// Twitter user streams were retired in 8/23/2018 so this code will no longer work
	//let userStream = Twitter.stream('just_a_bot');
	// When someone follows the user this bot is configured for
	//userStream.on('follow', followEvent);
}

// called from stream() when we are tracking a tweet event
function tweetEvent(tweet) {
    let trackingWord1 = 'shark attack';
    let trackingWord2 = '#shark';
    let trackingWord3 = '#sharkattack';
    let trackingWord4 = 'shark spotted'; 
    let filters = ['shark attack', '#shark', '#sharkattack', 'shark spotted'];

    var reply_to = tweet.in_reply_to_screen_name;
     // Check to see if this was, in fact, a reply to you
	  var date = tweet.created_at;
    var name = tweet.user.name;
    var location = tweet.user.location;
    var screenname = tweet.user.screen_name;
    var tweetText = tweet.text;
    //Look for tweet id so we can pass to retweet!
    //console.log("tweetEvent - tweet: ");
    //console.log(tweet);
    /*
    console.log("tweetEvent - date: " + date);
    console.log("tweetEvent - name: " + name);
    console.log("tweetEvent - screenname: " + screenname);
    console.log("tweetEvent - location: " + location);
    console.log("tweetEvent - text: " + tweetText);
    */

    for (const filter of filters) {
      if (tweetText.search(filter) !== -1) {
        console.log("FOUND tweet containing search word: ");
        Twitter.post('statuses/update', { status: tweetText }, function(err, response) {
	  console.log('Posted new tweet now....');
	  console.log(response);
  	});
      }
    }

}


function retweet(tweetText, retweetId, callback) {

  console.log("Trying to Retweet now...");
  Twitter.post('statuses/retweet/:id', { id: retweetId  }, function(err, response) {
      if (response) {
          console.log('Retweeted success - tweet id: ' + retweetId);
          console.log(response)
          callback("success")
      }
      else if (err) {
          console.log('Error trying to reweet: ' + retweetId);
          callback("error")
      }
  });

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

// Called via REST API
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

// Called via REST API
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

function post (content) {
  twitter.post('statuses/update', { status: content }, function(err, data, response) {
  })
}

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};


/////////////////////////// Search Examples ///////////////////////////
/*
var musicParties, 
        interactiveParties, 
        filmParties;

Twitter.get('search/tweets', { q: 'SXSW music party ', count: 100 }, function(err, data, response) {
  musicParties = data.statuses;
  console.log("MUS " + musicParties[0].text);
})

Twitter.get('search/tweets', { q: 'SXSW interactive party ', count: 100 }, function(err, data, response) {
  interactiveParties = data.statuses;
  console.log("INT " + interactiveParties[0].text);
})

Twitter.get('search/tweets', { q: 'SXSW film party ', count: 100 }, function(err, data, response) {
  filmParties = data.statuses;
  console.log("FLM " + filmParties[0].text);
})

Twitter.get('search/tweets', { q: 'JavaScript', count: 10 }, gotData);

function gotData(err, data) {
  var tweets = data.statuses;
  for (var i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }
}

*/