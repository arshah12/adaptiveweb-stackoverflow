var voteEventCount = 0;
var voteEventTime = 'Sat Sep 15 2018 23:31:32 GMT-0700 (US Mountain Standard Time)';
var questionEventCount = 0;
var questionEventTime = 'Sat Sep 15 2018 23:31:32 GMT-0700 (US Mountain Standard Time)';
var searchEventCount = 0;
var searchEventTime = 'Sat Sep 15 2018 23:31:32 GMT-0700 (US Mountain Standard Time)';
var askQuestionEventCount = 0;
var askQuestionEventTime = 'Sat Sep 15 2018 23:31:32 GMT-0700 (US Mountain Standard Time)';
var tagEventCount = 0;
var tagEventTime = 'Sat Sep 15 2018 23:31:32 GMT-0700 (US Mountain Standard Time)';

window.onload = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (xhttp.responseText !== "success") {
                var userData = JSON.parse(xhttp.responseText);
                console.log(userData);
                for (var i = 0; i < userData.length; i++) {
                    if (userData[i].event === "vote") {
                        voteEventCount++;
                        voteEventTime = Date.parse(voteEventTime) > Date.parse(userData[i].timestamp) ? voteEventTime : userData[i].timestamp;
                    } else if (userData[i].event === "question") {
                        questionEventCount++;
                        questionEventTime = Date.parse(questionEventTime) > Date.parse(userData[i].timestamp) ? questionEventTime : userData[i].timestamp;
                    } else if (userData[i].event === "search") {
                        searchEventCount++;
                        searchEventTime = Date.parse(searchEventTime) > Date.parse(userData[i].timestamp) ? searchEventTime : userData[i].timestamp;
                    } else if (userData[i].event === "askQuestion") {
                        askQuestionEventCount++;
                        askQuestionEventTime = Date.parse(askQuestionEventTime) > Date.parse(userData[i].timestamp) ? askQuestionEventTime : userData[i].timestamp;
                    } else if (userData[i].event === "tags") {
                        tagEventCount++;
                        tagEventTime = Date.parse(tagEventTime) > Date.parse(userData[i].timestamp) ? tagEventTime : userData[i].timestamp;
                    }
                }
                document.getElementById("voteEventCount").innerHTML = voteEventCount;
                document.getElementById("voteEventTime").innerHTML = voteEventTime;
                document.getElementById("questionEventCount").innerHTML = questionEventCount;
                document.getElementById("questionEventTime").innerHTML = questionEventTime;
                document.getElementById("searchEventCount").innerHTML = searchEventCount;
                document.getElementById("searchEventTime").innerHTML = searchEventTime;
                document.getElementById("askQuestionEventCount").innerHTML = askQuestionEventCount;
                document.getElementById("askQuestionEventTime").innerHTML = askQuestionEventTime;
                document.getElementById("tagEventCount").innerHTML = tagEventCount;
                document.getElementById("tagEventTime").innerHTML = tagEventTime;
            }
        }
    };
    xhttp.open("POST", "http://localhost:8080/homedata", true);
    xhttp.send();
};
