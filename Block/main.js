export default (request) => {
    // Required modules
    const db = require("kvstore"); // Database module
    const pubnub = require("pubnub"); // pubnub module
    const xhr = require("xhr"); // xmlHttp request module
    const Promise = require('promise'); // promise module
    
    var date_const = new Date(); // Date constructor
	var message_dict = {};
	
    const basicAuth = require('codec/auth');
    var username = '9dbcd599-cd60-4196-8a43-8e2ef7f5af1d'; // Username for the toneanalyzer api
    var password = 'U4ptOB82jfp4';                         // password for the toneanalyzer api
    var auth = basicAuth.basic(username,password);
    
    var TimeLimit = 2;
    var minute = 60*60*24; // In minutes
    var diff_inminutes = null;


    console.log(auth);
    // URL for the toneanalyzer
    const url = "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&tones=emotion";

    // http options for the rest call.
    const http_options = {
        "method": "POST",
        
        "headers": {
                "Content-Type": "application/json",
                "Authorization":auth
    },
            "body":{}
    };
    
    // variables required 
    var AngerAvgScore = 0;
    var FearAvgScore = 0;
    var SadnessAvgScore = 0;
    var DisgustAvgScore = 0;
    var JoyAvgScore = 0;
    var xhrfetchcalllist = [];   
    var tweetlength = request.message.twitterfeed.length; // number of tweets
    var twitterfeed = request.message.twitterfeed; // messages from twitter
    var brandname =  request.message.brandname; // brandname
    
            
   
    
    var tonescoreDict = {"AngerAvgScore":0,"FearAvgScore":0,"SadnessAvgScore":0,"DisgustAvgScore":0,"JoyAvgScore":0}
        
    /*
		Name - sendToApp
		Description - Function which calculates the avg tweet score 
		Parameters - brandname : Name of the brand for which we are getting the tweets.					 

	*/ 
    function sendToApp(brandname)
    {
        console.log("SENDTOAPP FUNCTION, and the brandname is ",brandname);
        return db.get(brandname).then((database_value) => {
            console.log(" DATA IN DATABASE -- >",database_value);
            var database_tweetscore = database_value.tweetscore;
            var tweetscore = {};
            // calculating the average tweet score.
            for (var key in database_tweetscore){
                tweetscore[key] = database_tweetscore[key]/tweetlength;
            }
            console.log("AFTER AVERAGE CALCULATION",tweetscore)
            request.message.tonescore = tweetscore;
            delete request.message.twitterfeed;
            return request;
            });
    }

    /*
		Name - api_call
		Description - Function which does the toneanalyzer api call.							 

	*/ 
    function api_call(){
        for (var i=0;i<twitterfeed.length;i++) 
            {
            http_options.body = {"text":twitterfeed[i][Object.keys(twitterfeed[i])[0]]};
            xhrfetchcalllist.push(xhr.fetch(url,http_options));
            }

   
            return Promise.all(xhrfetchcalllist)
                .then(function (responses) {
                    for (var j=0;j<responses.length;j++)
                    {
                     const body = JSON.parse(responses[j].body);
                        
                        // Iterating through the tweets
                        for (var t=0;t<body.document_tone.tone_categories[0].tones.length;t++)
                        {
                            var scoredetails = body.document_tone.tone_categories[0].tones[t]
                            // console.log(scoredetails);
                            if (scoredetails.tone_id == "anger")
                            {
                                AngerAvgScore = AngerAvgScore+scoredetails.score;
                        

                            }
                            if (scoredetails.tone_id == "fear")
                            {
                                FearAvgScore = FearAvgScore+scoredetails.score;
                        
                            }
                            if (scoredetails.tone_id == "disgust")
                            {
                                
                                DisgustAvgScore = DisgustAvgScore+scoredetails.score;
                        
                            }
                            if (scoredetails.tone_id == "sadness")
                            {
                                SadnessAvgScore = SadnessAvgScore+scoredetails.score;
                            }
                            if (scoredetails.tone_id == "joy")
                            {
                                JoyAvgScore = JoyAvgScore+scoredetails.score;
                        
                            }

                            
                        }
                        tonescoreDict = {"tweetscore":{"AngerAvgScore":AngerAvgScore,"FearAvgScore":FearAvgScore,"SadnessAvgScore":SadnessAvgScore,"DisgustAvgScore":DisgustAvgScore,"JoyAvgScore":JoyAvgScore},"lastupdatedTime":date_const.getTime()};
                        console.log("INDIVIDUAL",tonescoreDict);
                         
                    }

                    console.log("FINAL TONE SCORE",tonescoreDict);
                    // storing the tonescore for that particular brandname in the database.
                    db.set(brandname,tonescoreDict);
                    var tweetscore_dict = {};
                    var tweetscore_apicall = {};
                    
                    tweetscore_dict = tonescoreDict.tweetscore;

                    console.log(tweetscore_dict,tweetlength,"TWEET SCORE, TWEET LENGTH");
                    // Calculating the average of the tweet score
                    for (var tweetkey in tweetscore_dict){
                        tweetscore_apicall[tweetkey] = tweetscore_dict[tweetkey]/tweetlength;
                    }
                    console.log("AFTER AVERAGE CALCULATION",tweetscore_apicall);
                    delete request.message.twitterfeed;
                    request.message.tonescore = tweetscore_apicall;
                    console.log(request.message,"REQUEST MESSAGE API CALL");
                
                    return request;
                    
                });
                    
                
           
    }




    return db.get(brandname).then((database_value) =>{
    	
    	// checking if the brandname given is there in the database or not
        if (database_value)
        {
            var currentTime = date_const.getTime(); // Getting the Current time
            var lastupdatedTime = database_value.lastupdatedTime; // Extracting the Lastupdate time from the Database.
            
            var diff_inminutes = Math.round((currentTime - lastupdatedTime)/minute); // Calculating Time difference
            
            console.log("TIME DIFFERENCE IN MINUTES --> ",diff_inminutes);
            
            // Checking if the last toneanalyzer call happend with in 15 mins or not
            // if it is greater than 15 mins we will do fresh toneanalyzer api or else
            // we will give the value that we got in the previous call.
             if (diff_inminutes>=TimeLimit)
            {
                console.log("15 MIN ONCE");
                return api_call().then((x)=>{
                    return request;
                });                
                
            }
            else{
                
                return sendToApp(brandname).then((x)=>{
                    return request;
                });
                
            }
        }
        // if the brandname is not in the database, we will do a fresh toneanalyzer api call to get
        // the tweet score for that new brandname.
        else{
            console.log("FOR THE FIRST TIME");
            return api_call().then((x)=>{
                    return request;
                }); 
                             
        } 
        return request.ok();  
    });
    
};