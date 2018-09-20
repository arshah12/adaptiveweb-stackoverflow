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

var visUserVotes = 0;
var visUserSearch = 0;
var visUserTag = 0;
var visUsers = 0;

window.onload = function () {
    return fetchUserData();
};

function fetchUserData () {
    var xhttp = new XMLHttpRequest();
    var xhttp3 = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (xhttp.responseText !== "success") {
                var userData = JSON.parse(xhttp.responseText);
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

                xhttp3.send();

                document.getElementById("voteEventCount").innerHTML = voteEventCount;
                document.getElementById("voteEventTime").innerHTML = voteEventTime.replace('(US Mountain Standard Time)','');
                document.getElementById("questionEventCount").innerHTML = questionEventCount;
                document.getElementById("questionEventTime").innerHTML = questionEventTime.replace('(US Mountain Standard Time)','');
                document.getElementById("searchEventCount").innerHTML = searchEventCount;
                document.getElementById("searchEventTime").innerHTML = searchEventTime.replace('(US Mountain Standard Time)','');
                document.getElementById("askQuestionEventCount").innerHTML = askQuestionEventCount;
                document.getElementById("askQuestionEventTime").innerHTML = askQuestionEventTime.replace('(US Mountain Standard Time)','');
                document.getElementById("tagEventCount").innerHTML = tagEventCount;
                document.getElementById("tagEventTime").innerHTML = tagEventTime.replace('(US Mountain Standard Time)','');
            }
        }
    };
    xhttp.open("POST", "http://localhost:8080/homedata", true);
    xhttp.send();

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (xhttp2.responseText !== "success") {
                var j = 0;
                var userData = JSON.parse(xhttp2.responseText);
                for (var i = userData.length-1; i >= userData.length - 5 ; i--) {
                    var newRow = document.getElementById("logData").insertRow(j);
                    j++;
                    newRow.insertCell(0).innerHTML = userData[i].timestamp.replace('(US Mountain Standard Time)','');;
                    if ( i === 0 ) {
                        break;
                    }
                }
                var newRow = document.getElementById("logData").insertRow(0);
                newRow.insertCell(0).innerHTML = '<b> Previous Login\'s </b>';

            }
        }
    };
    xhttp2.open("POST", "http://localhost:8080/loghistory", true);
    xhttp2.send();

    xhttp3.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var visData = JSON.parse(xhttp3.responseText);
            for (var user in  visData) {
                visUsers++;
                for (var i=0; i<visData[user].length; i++) {
                    if (visData[user][i] === 'vote' ) {
                        visUserVotes++;
                    } else if (visData[user][i] === 'search' ) {
                        visUserSearch++;
                    } else if (visData[user][i] === 'tags' ) {
                        visUserTag++;
                    }
                }
            }
            var totalEvents = visUserVotes + visUserSearch + visUserTag;
            var totalCurrentEvents = voteEventCount + searchEventCount + tagEventCount;
            var data = [{
                values: [(visUserVotes*100)/totalEvents, (visUserSearch*100)/totalEvents, (visUserTag*100)/totalEvents],
                labels: ['Vote Activity', 'Search Bar Activity', 'Tag Activity' ],
                domain: {
                    x: [0, .48]
                },
                name: 'All Users',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },{
                values: [(voteEventCount*100)/totalCurrentEvents, (searchEventCount*100)/totalCurrentEvents,
                    (tagEventCount*100)/totalCurrentEvents ],
                labels: ['Vote Activity', 'Search Bar Activity', 'Tag Activity' ],
                text: 'Current User',
                textposition: 'inside',
                domain: {x: [.52, 1]},
                name: 'Current User',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            }];
            console.log(data);
            var layout = {
                title: 'All Users VS Current User activities',

                annotations: [
                    {
                        font: {
                            size: 11
                        },
                        showarrow: false,
                        text: 'All Users',
                        x: 0.17,
                        y: 0.5
                    },
                    {
                        font: {
                            size: 11
                        },
                        showarrow: false,
                        text: 'You',
                        x: 0.78,
                        y: 0.5
                    }
                ],
                height: 400,
                width: 650
            };

            Plotly.newPlot('donut', data, layout);

            var layout = {
                title: 'Click on Donut chart for value comparison'
            };

            Plotly.newPlot('barchart', null, layout);

            var donutElement = document.getElementById('donut');
            donutElement.on('plotly_click', function (data) {
                var xValue = '';
                var yValue = [];
                var yValue2 = [];
                if (data.points[0].label === 'Vote Activity') {
                    xValue = 'Vote Activity';
                    yValue.push(voteEventCount);
                    yValue2.push((visUserVotes/visUsers).toFixed(2));
                } else if (data.points[0].label === 'Search Bar Activity') {
                    xValue = 'Search Bar Activity';
                    yValue.push(searchEventCount);
                    yValue2.push((visUserSearch/visUsers).toFixed(2));
                } else if (data.points[0].label === 'Tag Activity') {
                    xValue = 'Tag Activity';
                    yValue.push(tagEventCount);
                    yValue2.push((visUserTag/visUsers).toFixed(2));
                }

                var trace2 = {
                    x: xValue,
                    y: yValue,
                    type: 'bar',
                    text: yValue,
                    name: 'You',
                    textposition: 'auto',
                    hoverinfo: 'none',
                    marker: {
                        color: 'rgba(58,200,225,.5)',
                        line: {
                            color: 'rbg(8,48,107)',
                            width: 1.5
                        }
                    }
                };

                var trace1 = {
                    x: xValue,
                    y: yValue2,
                    type: 'bar',
                    text: yValue2,
                    name: 'All Users',
                    textposition: 'auto',
                    hoverinfo: 'none',
                    opacity: 0.5,
                    marker: {
                        color: 'rgb(158,202,225)',
                        line: {
                            color: 'rbg(8,48,107)',
                            width: 1.5
                        }
                    }
                };

                var data = [trace1,trace2];

                var layout = {
                    title: 'Average User Activity VS Your Activity',
                    height: 400
                };

                Plotly.newPlot('barchart', data, layout);

            });
        }
    };
    xhttp3.open("POST", "http://localhost:8080/visualization", true);
}

