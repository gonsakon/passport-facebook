// server.js
require('./db');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var path = require('path');
var partials = require('express-partials');
app.use(partials());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//指定路徑
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.cookieParser());
app.use(session({
    secret: 'qqaabbcddd'
}));
// set the view engine to ejs
app.set('view engine', 'ejs');
// app.set('layout', 'view/layout');
// app.set('views', __dirname + '/views');
// app.set("view options", {layout : true});
var mongoose = require('mongoose');
var alluser = mongoose.model('alluser');
//fb login
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: xxxxxx, //設立的FB APP 資訊
        clientSecret: xxxx, //設立的FB APP 資訊
        callbackURL: "http://localhost:3000/auth/facebook/callback" //設立的FB callback網址
    },
    function(accessToken, refreshToken, profile, done) {
        alluser.findOne({
            id: profile.userid
        }, function(err, doc) {
            if (doc) {
                return done(null, doc);
            } else {
                new alluser({
                    userid: profile.id,
                    name: profile.name.familyName + profile.name.givenName,
                    token: accessToken,
                }).save(function(err, user) {
                    if (err) {
                        console.log('Fail to save to DB.');
                        return;
                    }
                    console.log('Save to DB.');
                    return done(null, user);
                });
            }

        });
        passport.serializeUser(function(user, done) {
            done(null, user);
        });
        passport.deserializeUser(function(obj, done) {
            done(null, obj);
        });
    }));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        if (req.user) {
            req.session.name = req.user.name;
            res.redirect('/');
        }
    });
app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        res.render('pages/index', {
            yourname: req.user.name
        });
    } else {
        res.render('pages/index', {
            yourname: '訪客'
        });
    }
});
app.get('/login', function(req, res) {
    res.render('pages/login');
});
app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
