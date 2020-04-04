var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
    res.render('final/views/pages/index');
});

// change password page

app.get('/change-password', function (req, res) {
    res.render('final/pages/change-password');
});

// login page

app.get('/login', function (req, res) {
    res.render('final/pages/login');
});

// profile page

app.get('/profile', function (req, res) {
    res.render('final/pages/profile');
});

// settings page

app.get('/settings', function (req, res) {
    res.render('final/pages/settings');
});

// change password page

app.get('/signup', function (req, res) {
    res.render('final/pages/signup');
});

app.listen(8080);
