var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var createRequest = require('request');

const url = require('url');
const MongoClient = require('mongodb').MongoClient;


//add publiv library
app.use(express.static(path.join(__dirname, 'public')));

//add view engine and body parser
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'Gotcha',
    resave: true,
    saveUninitialized: true
}));

var db;

MongoClient.connect('mongodb://arshah12:mongodb123@ds151602.mlab.com:51602/adaptive-web-db',
    function (error, client) {
        if (error) return console.log(error);
        db = client.db('adaptive-web-db');
        app.listen(8080);
    });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/login', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('index');
});

app.get('/signup', function (req, res) {
    res.render('signup', {error: ''});
});


app.post('/createUser', function (req, res) {
    console.log(req.body);
    db.collection('userInfo', function (err, collection) {
        collection.find({username: req.body.name}).toArray(function (mongoError, results) {
            console.log(results);
            if (results === undefined || results.length === 0) {
                collection.save({username: req.body.name, password: req.body.pwd}, function (err, result) {
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.cookie('name', req.body.name, {maxAge: 900000, httpOnly: true});
                    res.render('home', {name: req.body.name});
                });
            } else {
                res.render('signup', {error: 'Username already present'});
            }
        });
    });
});

app.post('/home', function (req, res) {
    if (req.body.name === "") {
        nameError = 'Please enter name';
        res.render('index');
    }
    else if (req.body.pwd === "") {
        password = 'Please enter password';
        res.render('index');
    } else {
        db.collection('userInfo', function (err, collection) {
            collection.find({username: req.body.name, password: req.body.pwd}).toArray(function (mongoError, results) {
                console.log(results);
                if (results.length === 0) {
                    res.render('index');
                } else {
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.cookie('name', req.body.name, {maxAge: 900000, httpOnly: true});
                    res.render('home', {name: req.body.name});
                }
            });
        });
        console.log('after');
    }
});

app.post('/logout', function (req, res) {
    res.clearCookie('name');
    res.redirect('/login');
});

app.post('/lan', function (req, res) {
    data = "";
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        console.log(JSON.parse(data).username);
        var requestData = JSON.parse(data);
        if (requestData.username !== undefined) {
            console.log("data");
            db.collection('eventData', function (err, collection) {
                collection.save({
                        username: requestData.username,
                        event: requestData.event,
                        timestamp: (new Date()).toString()
                    },
                    function () {
                        res.send("success");
                    });
            });
        }
    });

});

app.post('/homedata', function (req, res) {
    console.log(req.cookies.name);
    db.collection('eventData', function (err, collection) {
        collection.find({username: req.cookies.name}).toArray(function (mongoError, results) {
            if (results.length === 0) {
                res.send("success");
            } else {
                res.send(results);
            }
        });
    });

});
