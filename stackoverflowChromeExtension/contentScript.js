
var voteElements = document.getElementsByClassName("vote");
var questionElements = document.getElementsByClassName("question-hyperlink");
var searchElement = document.getElementById("search");
var askQuestionElement = document.getElementsByClassName("d-inline-flex ai-center ws-nowrap s-btn s-btn__primary")[0];
var tagElements = document.getElementsByClassName("post-tag");

if (voteElements !== undefined && voteElements.length !== 0) {
    for (var i =0; i<voteElements.length; i++) {
        voteElements[i].addEventListener('click', function(event) { 
            console.log(event);
            var port = chrome.runtime.connect({name: "knockknock"});
            port.postMessage({event: "vote"});
        });
    }
}

if (questionElements !== undefined || questionElements.length === 0) {
    for (var i =0; i<questionElements.length; i++) {
        questionElements[i].addEventListener('click', function(event) { 
            console.log(event);
            var port = chrome.runtime.connect({name: "knockknock"});
            port.postMessage({event: "question"});
        });
    }          
}

if (searchElement !== undefined) {
    searchElement.addEventListener('submit', function(event) {
        console.log(event);
        var port = chrome.runtime.connect({name: "knockknock"});
        port.postMessage({event: "search"});
    });
}

if (askQuestionElement !== undefined) {
    askQuestionElement.addEventListener('click', function(event) {
        console.log(event);
        var port = chrome.runtime.connect({name: "knockknock"});
        port.postMessage({event: "askQuestion"});
    });
}

if (tagElements !== undefined && voteElements.length !== 0) {
    for(var i=0; i<tagElements.length; i++) {
        tagElements[i].addEventListener('click', function(event) {
            console.log(event);
            var port = chrome.runtime.connect({name: "knockknock"});
            port.postMessage({event: "tags"});
        });
    }
}