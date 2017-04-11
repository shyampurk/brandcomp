# Brandceptions

A web app for comparing the social media (Twitter) perception of two brands. This is built using IBM Watson Tone Analyzer and PubNub BLOCKS. 

# Hosting Instructions

Clone this repository and configure the Watson Tone Analyzer and Twitter API to access those third party services.
You will need to update the credentials of these services in the code.

# Setup Watson Tone Analyzer API

Step 1 : Login to the Bluemix account with the valid credentials, and goto Catalog.<br>
Step 2 : Select the Tone Analyzer service under the Watson Services.
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/ToneAnalyzer/b_1.png)
Step 3 : Give the service name and select the standard plan, you can see more about pricing there in that page, and click on the "create" button.
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/ToneAnalyzer/b_2.png)
Step 4 : Once you create the service, it will redirect you the homepage of the service. There click on the "Service Credentials" to get the username and password to access the toneanalyzer api.
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/ToneAnalyzer/b_3.png)

Step 5 : Goto the [program](https://github.com/shyampurk/brandcomp/blob/master/Block/main.js) and set the username and password that you got from "step4" in the following lines<br>
	username - line number 12 <br>
	password - line number 13 <br>
	
You can check the following [link](https://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/) to learn how to use the Toneanalyzer using curl/node/python/java.


# Setup for Twitter API

Step 1 : Login to https://apps.twitter.com/ with your valid twitter credentials
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/Twitter/t_1.png)
Step 2 : Click on the "Create New App" button to create a new twitter application.
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/Twitter/t_2.png)
Step 3 : Give the Application name and description about the application and give the website (give the dummy one if you dont have one) and click on "create your Twitter application"
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/Twitter/t_4.png)
Step 4 : Once the app is created click on the "Keys and Access Tokens" and copy the <br>
	1)Consumer Key <br>
	2)Consumer Secret <br>
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/Twitter/t_5.png)	
Step 5 : scroll down the page click on "create my access token" button.
![alt-tag](https://github.com/shyampurk/brandcomp/blob/master/screenshots/Twitter/t_7.png)
Step 6 : Once access token is created copy the <br>
	3)Access Token <br>
	4)Access Token Secret <br>

These Four keys will be used for you to access the Twitter api from your Node.js Web Server.

Add these 4 parameters in the [code](https://github.com/shyampurk/brandcomp/blob/master/App/routes/index.js)
in these following lines,<br>
 	1)Consumer Key  - line number 15 <br>
	2)Consumer Secret  - line number 16 <br>
	3)Access Token  - line number 17 <br>
	4)Access Token Secret  - line number 18 <br>	


