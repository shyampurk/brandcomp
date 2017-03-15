var express = require('express');
var Twitter = require('twitter');

var router = express.Router(); 
var consumer_key = 'Gzw1GkaD7lbKHCN6ZqZMaGpui';
var consumer_secret = 'pPvhPLpzJzy1DAWwuCzkTMOHJSHb3kT613wXCcCNdKdBZOwrsm';
var access_token_key = '756133355905650688-B1QdpUgDq7agg6AJuZlktxl6lyrmDa4';
var access_token_secret = 'ScZXDflko1qCUpbLBYMUHVQOmMvihUpB7rzlL13pdK6JJ';

//////////////////
// PUBNUB INIT  //
//////////////////

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-578b72c9-0ca2-4429-b7d4-313bbdf9b335",
    subscribe_key : "sub-c-471f5e36-e1ef-11e6-ac69-0619f8945a4f"
});
 
var client = new Twitter({
  	consumer_key: consumer_key,
  	consumer_secret: consumer_secret,
  	access_token_key: access_token_key,
  	access_token_secret: access_token_secret
});

var tweetResulttype = 'mixed'; // only popular tweets
var tweetLanguage = 'en'; // only english language tweets
var count = 3; // limit tweets to 10

var brandList = []

twitterapi_output = {};

router.post('/gettweet', function(req, res, next) {
	console.log(req.body)
	var brand1 = req.body.Brand1
	var brand2 = req.body.Brand2
	var brandList = [brand1,brand2]
	var finalListbrand1 = []
	var finalListbrand2 = []
	console.log(brandList)
	var tweetArray1 = [];
	var tweetArray2 = [];

	function pubPublish(tweets){
    	pubnub.publish({
		    channel   : 'realtimebrandmonitor',
		    message   : tweets,
		    callback  : function(e) { 
		        console.log( "SUCCESS!", e );
		    },
		    error     : function(e) { 
		        console.log( "FAILED! RETRY PUBLISH!", e );
		    }
		});
    } 

    var params = { q:brandList[0], result_type:tweetResulttype, lang:tweetLanguage, count:count };

    client.get('search/tweets', params, function(error, tweets, response) {
	    console.log("tweet length :",tweets.statuses.length);

	    if (!error) {

	    	for (var j=0;j<tweets.statuses.length;j++) {
		    	var key = (tweets.statuses[j].id_str).toString();
		    	tweetArray1.push({[key]:tweets.statuses[j].text});
		    }

	        twitterapi_output[params.q] = tweetArray1;

	        toblock = {"twitterfeed":tweetArray1,"brandname":brandList[0]};
	        finalListbrand1.push(toblock);
	        console.log("finalListbrand1: ",finalListbrand1[0]);
	    	pubPublish(finalListbrand1[0])
		}
		else {
			console.log("error")
		}
	});
	
	setTimeout(function(){
		var params1 = { q:brandList[1], result_type:tweetResulttype, lang:tweetLanguage, count:count };

		    client.get('search/tweets', params1, function(error, tweets, response) {
			    console.log("tweet length :",tweets.statuses.length);
			    if (!error) {

			    	for (var j=0;j<tweets.statuses.length;j++) {
				       var key = (tweets.statuses[j].id_str).toString();
				       tweetArray2.push({[key]:tweets.statuses[j].text});
				    }

			        twitterapi_output[params.q] = tweetArray2;

			        toblock = {"twitterfeed":tweetArray2,"brandname":brandList[1]};
			        finalListbrand2.push(toblock);
			        console.log("finalListbrand2: ",finalListbrand2[0]);
			        pubPublish(finalListbrand2[0])
				}
				else {
					console.log("error")
				}
			});
		    res.status(200);
	},10000);
		
});

router.get('/', function(req, res, next) {
	
    res.status(200).render('index', { title: 'Express'});

});

module.exports = router;
