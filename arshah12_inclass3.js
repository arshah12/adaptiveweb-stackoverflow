var http = require('http');
var url = require('url');
var qstring = require('querystring');

function sendResponse(weatherData, res, city) {
    if (city === undefined) {
        var page = '<html><head><title>External Example</title></head>' +
            '<body>' +
            '<form method="post">' +
            'City: <input name="city"><br>' +
            '<input type="submit" name="weather" value="Weather">' +
            '<input type="submit" name="weather" value="Forecast">' +
            '</form>';
    } else {
        var page = '<html><head><title>External Example</title></head>' +
            '<body>' +
            '<form method="post">' +
            'City: <input name="city" value=' + city + '><br>' +
            '<input type="submit" name="weather" value="Weather">' +
            '<input type="submit" name="weather" value="Forecast">' +
            '</form>';
    }
    if (weatherData) {
        var weatherJson = JSON.parse(weatherData);

        page += '<h1>Weather Info</h1><p>' + weatherData + '</p>';
    }
    page += '</body></html>';
    res.end(page);
}

function parseWeather(weatherResponse, res, city) {
    var weatherData = '';
    weatherResponse.on('data', function (chunk) {
        weatherData += chunk;
    });
    weatherResponse.on('end', function () {
        sendResponse(weatherData, res, city);
    });
}

// You will need to go get your own free API key to get this to work
function getWeather(city, api, res) {
    if (api === 'Weather') {
        var options = {
            host: 'api.openweathermap.org',
            path: '/data/2.5/weather?q=' + city + "&APPID=f9cd3610e9144f965638b5be216a0b1d"
        };
    }
    else {
        var options = {
            host: 'api.openweathermap.org',
            path: '/data/2.5/forecast?q=' + city + "&APPID=f9cd3610e9144f965638b5be216a0b1d"
        };
    }
    http.request(options, function (weatherResponse) {
        parseWeather(weatherResponse, res, city);
    }).end();
}

http.createServer(function (req, res) {
    //console.log(req.method);
    var cookie = getParsedCookies(req);
    if (req.method === "POST") {
        var reqData = '';
        req.on('data', function (chunk) {
            reqData += chunk;
        });
        req.on('end', function () {
            var postParams = qstring.parse(reqData);
            res.setHeader('Set-Cookie', 'city=' + postParams.city);
            getWeather(postParams.city, postParams.weather, res);
        });
    } else if (req.method === "GET") {
        if (cookie.city === undefined)
            sendResponse(null, res);
        else {
            //console.log(cookie.city);
            sendResponse(null, res, cookie.city);
        }
    } else {

        sendErrorResponse(res);
    }
}).listen(8080);

function sendErrorResponse(res) {

    res.writeHead(405);
    var page = '<html><head><title>External Example</title></head>' +
        '<body>' +
        '<h3>Method Not Allowed</h3><br/>' +
        '<p><a href="http://localhost:8080" />HomePage</p>';
    page += '</body></html>';
    res.end(page);

}

function getParsedCookies(request) {

    var cookies = {};
    var requestCookies = request.headers.cookie;

    if (requestCookies) {
        requestCookies.split(';').forEach(function (cookie) {
            var chunk = cookie.split('=');
            cookies[chunk.shift().trim()] = decodeURI(chunk.join('='));
        });
    }

    return cookies;
}