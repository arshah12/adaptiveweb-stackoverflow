// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var userNameFromCookie;

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'localhost:8080'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
        
    }]);
  });
});

chrome.webNavigation.onCompleted.addListener(function() {
    chrome.cookies.get({url: "http://localhost:8080/*", name: "name"}, function(cookie) {
        console.log(cookie);
        userNameFromCookie = cookie.value;
    });
  }, {url: [{urlMatches : 'http://localhost:8080/home'}]});

chrome.webNavigation.onCompleted.addListener(function() {
    chrome.cookies.get({url: "http://localhost:8080/*", name: "name"}, function(cookie) {
        console.log(cookie);
        userNameFromCookie = undefined;
    });
  }, {url: [{urlMatches : 'http://localhost:8080/login'}]});


chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              console.log('sent');
            }
        };
        xhttp.open("POST", "http://localhost:8080/lan", true);
        
        var postData = {
            event : msg.event,
            username : userNameFromCookie
        }
        xhttp.send(JSON.stringify(postData));
  });
});