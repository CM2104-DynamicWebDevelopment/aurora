
//**************** DATABASE and EXPRESS connections *************************

// Database Connections

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://localhost:27017/usersdb";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

// Node Modules

var multer = require('multer');
var path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Multer DiskStorage - for storing images

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads/aurora');
  },
  filename: function (req, file, cb) {
    let a = Math.floor(Math.random() * 1001);
    cb(null, file.fieldname + '-' + a + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

// Initalising Express

app.use(express.static('public'));

app.use(session({secret: 'keyboard cat'}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

var db;

// connecting variable db to database
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});


//******************** GET ROUTES - display pages **************************

// using res.render to load up an ejs view files

// root route
app.get('/', function (req, res) {

// get the details of the latest photo uploaded
db.collection('photo').find({}).sort({'_id':-1}).limit(1).toArray(function (err, result) {
    console.log(result);
    // get the filename of the latest photo uploaded
    var arrayphoto = result[0].filename;
    console.log(arrayphoto);
    // render the index page and pass the filename of the latest photo uploaded as a variable
    res.render("pages/index",{photo: arrayphoto});
    });
});

// change password route
app.get('/change-password', function (req, res) {
    res.render('pages/change-password');
});

// login route

app.get('/login', function (req, res) {
    var msg = '';
    res.render('pages/login', {
        login_error: msg
    });
});

// profile route

app.get('/profile', function (req, res) {
    res.render('pages/profile');
});

// settings route

app.get('/settings', function (req, res) {
    res.render('pages/settings');
});

// change password route

app.get('/signup', function (req, res) {
    res.render('pages/signup');
});

// upload photo route

app.post('/upload', upload.single('aurora'), function (req, res, next) {
  // req.file is the `photo` file
    console.log("success");
    console.log(req.file);
    console.log(req.file.filename);
    var photofile = req.file;

    // resize image to 235px width
    sharp(req.file.path)
                    .resize(235)
                    .toBuffer(function(err, buffer) {
        if (err) throw err;
        fs.writeFile(req.file.path, buffer, function(e) {
        });
    });

    // save image file details in db
    db.collection('photo').save(photofile, function(err, result) {
    if (err) throw err;
    console.log('saved to database');
    });

    res.redirect("/");
});

//login form handler
app.post('/dologin', function(req,res){
    var name = req.body.name;
    var password = req.body.password;
    var error_msg = '';
    
    if(name == '' || password == ''){
        error_msg = 'Please enter your username and password';
                   res.render('pages/login', {
                       login_error: error_msg
                   }); return
    }
    db.collection('profiles').findOne({'username':name}, function(err, result){
        if(err) throw err;
        if(!result){
                   error_msg = 'The username or password you entered are incorrect';
                   res.render('pages/login', {
                       login_error: error_msg
                   }); return}
        if(result.password == password){
            req.session.loggedin = true; 
            req.session.user = name;
            res.redirect('/');
        }else{
              error_msg = 'The username or password you entered are incorrect';
                   res.render('pages/login', {
                       login_error: error_msg
                   }); return}
        });
    });
