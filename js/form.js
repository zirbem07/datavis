$(document).ready(function(){
	var chatRef = new Firebase('https://codehscore.firebaseio.com');
	var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
		if (error) {
	    // an error occurred while attempting login
	    alert(error);
	} else if (user) {
	    // user authenticated with Firebase
	    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);

        $('#signOut').on('click', function () {
            auth.logout();
        });

	    userId = user.uid;
	    var dataRef = new Firebase('https://codehscore.firebaseio.com/users/'+user.uid+'/info/permissions');
	    dataRef.on('value' , function(snapshot) {
            if(snapshot.val() == 1){
                $('#admin').append(
                    $('<a></a>').attr('href','admin.html').text("Admin")
                );

            }
		},function(err) {
  			// Read fails
  			alert("User does not have permissions value set");
  		});

	    //create a date
var currentTime = new Date()
var month = currentTime.getMonth() + 1
var day = currentTime.getDate()
var year = currentTime.getFullYear()
var date = month + "-" + day + "-" + year;
//used to insert dummy data
 // date = '6-25-2014';

//check to see if stats for current date exist, if so, populate vars with db data
var checkRef = new Firebase('https://codehscore.firebaseio.com/users/' +user.uid+ '/stats/');

checkRef.on('value', function(snapshot) {
	var data = snapshot.val();
	if (snapshot.hasChild(date)){
		twitterNum = data[date]['twitterNum'];
		redditNum = data[date]['redditNum'];
		stackNum = data[date]['stackNum'];
		quoraNum = data[date]['quoraNum'];	
		githubNum = data[date]['githubNum'];
		blogNum = data[date]['blogNum'];
		linkedInNum = data[date]['linkedInNum'];
		dailyTicketNum = data[date]['dailyTicketNum'];
	}
	//if stats for current date do not exist, make all vars 0
	else{
		twitterNum = 0;
		redditNum = 0;
		stackNum = 0;
		quoraNum = 0;	
		githubNum = 0;
		blogNum = 0;
		linkedInNum = 0;
		dailyTicketNum = 0
		totalDailyScore = 0;
	}
}); //end of checkRef.on callback

$('.submit').on('click', function() {
	var submission = $('.info').val();
	var twitterNum = 0;
	var redditNum = 0;
	var stackNum = 0;
	var quoraNum = 0;	
	var githubNum = 0;
	var blogNum = 0;
	var linkedInNum = 0;
	var totalDailyScore = 0;
	var dailyTicketNum = 0;
	
	var statRef = new Firebase('https://codehscore.firebaseio.com/users/');

	//create a date
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()
	var date = month + "-" + day + "-" + year;
	// used to insert dummy data
	// date = '6-25-2014'; 

	// var dateRef = new Firebase('https://codehscore.firebaseio.com/users/simplelogin:28/stats/');
	var checkRef = new Firebase('https://codehscore.firebaseio.com/users/' + user.uid + '/stats/');
	
	//check to see if stats for current date exist, if so, populate vars with db data
	checkRef.on('value', function(snapshot) {
		var data = snapshot.val();
		if (snapshot.hasChild(date)){
			twitterNum = data[date]['twitterNum'];
			redditNum = data[date]['redditNum'];
			stackNum = data[date]['stackNum'];
			quoraNum = data[date]['quoraNum'];	
			githubNum = data[date]['githubNum'];
			blogNum = data[date]['blogNum'];
			linkedInNum = data[date]['linkedInNum'];
			dailyTicketNum = data[date]['dailyTicketNum'];
		}
		//if stats for current date do not exist, make all vars 0
		else{
			twitterNum = 0;
			redditNum = 0;
			stackNum = 0;
			quoraNum = 0;	
			githubNum = 0;
			blogNum = 0;
			linkedInNum = 0;
			dailyTicketNum = 0;
			totalDailyScore = 0;
		}
	});

	//regular expressions to match words
	var twitterReg = /twitter/g;
	var redditReg = /reddit/g;
	var stackReg = /stackoverflow/g;
	var quoraReg = /quora/g;
	
	//test submission to match regular expressions, if so, multiply amount by points and overwrite database vals
	if(twitterReg.test(submission)){
		var twitterCount = parseInt(submission.match(twitterReg).length);
		twitterNum += twitterCount; //will multiply by pts
	}
	if(redditReg.test(submission)){
		var redditCount = parseInt(submission.match(redditReg).length);
		redditNum += redditCount * 4; //will multiply by pts
	}
	if(stackReg.test(submission)){
		var stackCount = parseInt(submission.match(stackReg).length);
		stackNum += stackCount * 6; //will multiply by pts
	}
	if(quoraReg.test(submission)){
		var quoraCount = parseInt(submission.match(quoraReg).length);
		quoraNum += quoraCount * 5; //will multiply by pts
	}
	var githubCheck = $('.github').is(':checked');
	if (githubCheck){
		githubNum = 5;
	}
	var blogCheck = $('.blog').is(':checked');
	if (blogCheck){
		blogNum = 10;
	}
	var dailyTicketCheck = $('.dailyTicket').is(':checked');
	if (dailyTicketCheck){
		dailyTicketNum = 2;
	}
	var linkedInCount = parseInt($('.linkedIn').val());
	if (linkedInCount){
		linkedInNum += linkedInCount;
	}

	var onComplete = function(){
		window.open('newsfeed.html', '_self');
	}

	totalDailyScore += twitterNum + redditNum + stackNum + quoraNum + githubNum + blogNum + linkedInNum + dailyTicketNum;
	//set values for current date in database
	checkRef.child(date).set({'twitterNum': twitterNum, 'redditNum': redditNum, 
		'stackNum': stackNum, 'quoraNum': quoraNum, 
		'githubNum': githubNum, 'blogNum': blogNum, 
		'linkedInNum': linkedInNum, 'totalDailyScore': totalDailyScore, 
		'date': date, 'dailyTicketNum': dailyTicketNum}, onComplete );
	

}); //END OF SUBMIT BUTTON EVENT HANDLER

	} else {
	  	//User is not logged in
	  	window.open('index.html', '_self');
	  }
	}); //END OF AUTH CALLBACK FUNCTION
});