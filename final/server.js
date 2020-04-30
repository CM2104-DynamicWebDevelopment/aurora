
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
app.use(session({secret: 
    'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

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

session.loggedin = false;



//******************** GET ROUTES - display pages **************************

// root route
app.get('/', function (req, res) {
    var isLogged = req.session.loggedin;
    // get the details of the latest photo uploaded
    db.collection('photo').find({}).sort({'_id':-1}).limit(1).toArray(function (err, result) {
    console.log("Uploaded aurora photo details" + result);
   // get the filename of the latest photo uploaded
   var arrayphoto = result[0].filename;
   console.log("From db - aurora photo details" + arrayphoto);
    //render the index page and pass the filename of the latest photo uploaded as a variable
   res.render("pages/index",{photo: arrayphoto, isLoggedIn: isLogged});  
});
});

// change password route
app.get('/change-password', function (req, res) {
    var isLogged = req.session.loggedin;
    var msg = '';
    res.render('pages/change-password', {changepass_error: msg, isLoggedIn: isLogged});
});


// login route
app.get('/login', function (req, res) {
    var msg = '';
    var isLogged = req.session.loggedin;
    res.render('pages/login', {
        login_error: msg,
        isLoggedIn: isLogged
    });
});

// profile route
app.get('/profile', function (req, res) {

    //Login status
    var isLogged = req.session.loggedin;
    var loggedUser = req.session.username;
    console.log("Username is" + loggedUser);
    
    var if_observation = req.session.if_observation;

    console.log("If observation is:" + if_observation);

    if (if_observation == false){

        console.log("If statement works");

        // grab user details

        db.collection('profiles').find({username: loggedUser}).toArray(function (err, user) {
            console.log("User details" + user);
            // get user's details
            var username = user[0].username;
            var email = user[0].email;
            var arrayphoto = user[0].filename;
            console.log("Profile Pic is" + arrayphoto);
            console.log("Username is" + username);
            console.log("Email is" + email);

            // fake observation data

            var observation_records = [        { date:'You need', time:"to upload", latitude:'an', longitude:'observation.', observation_photo:'#' }   ];

            var date = observation_records[0].date;
            var time = observation_records[0].time;
            var longitude = observation_records[0].longitude;
            var latitude = observation_records[0].latitude;
            var auroraphoto = observation_records[0].observation_photo;

        observation_records.push(date, time, longitude, latitude, auroraphoto);
        console.log("testing: " + observation_records);

             // render the profile page and pass the filename of the latest photo uploaded as a variable
            res.render('pages/profile', {
                username: username,
                email: email,
                isLoggedIn: isLogged,
                profilephoto: arrayphoto,
                observation_records: observation_records
               });
        });

    } else {

     // get observations for the username
    db.collection('observations').find({username: loggedUser}).toArray(function (err, observation) {
        console.log("Observation is:" + observation);
        //get observation details
        var date = observation[0].date;
        var time = observation[0].time;
        var longitude = observation[0].longitude;
        var latitude = observation[0].latitude;
        var auroraphoto = observation[0].observation_photo;

        var observation_records = [];
        observation_records.push(date, time, longitude, latitude, auroraphoto);
        console.log("testing: " + observation_records);
        
        // get requested user by the username
        db.collection('profiles').find({username: loggedUser}).toArray(function (err, user) {
            console.log("User details" + user);
            // get user's details
            var username = user[0].username;
            var email = user[0].email;
            var arrayphoto = user[0].filename;
            console.log("Profile Pic is" + arrayphoto);
            console.log("Username is" + username);
            console.log("Email is" + email);
                
            // render the profile page and pass the filename of the latest photo uploaded as a variable
            res.render('pages/profile', {
                profilephoto: arrayphoto,
                username: username,
                email: email,
                isLoggedIn: isLogged,
                observation_records: observation
               });
            });
          });
    }
      });


// save observation on database  
app.post('/put-marker', upload.single('observation'), function (req, res, next) {
    var isLogged = req.session.loggedin;
    var error_msg = '';
    // check if user logged in
    if (!isLogged) {      
      error_msg = "Please login to tag the location";
              res.render('pages/login', {
                       tagging_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
    } else {
      // get location tag variables
      var username = req.body.username;
      var date = req.body.date;
      var time = req.body.time;
      var latitude = req.body.latitude;
      var longitude = req.body.longitude;
      var observation_photo = req.body.observation_photo;
      
      db.collection('observations').updateOne(({"username": username}), ({$set: { "date": date,
                                                                                  "time": time,
                                                                                   "latitude": latitude,
                                                                                  "longitude": longitude,
                                                                                  "observation_photo": observation_photo} })), function(err, result){
            if(err) throw err; 
               req.session.loggedin = false;
                req.session.if_observation == true;
          console.log("If observation:" + req.session.if_observation);
               res.redirect('/');
              }
        }
});


// settings route
app.get('/settings', function (req, res) {
    var isLogged = req.session.loggedin;
    res.render('pages/settings', {isLoggedIn: isLogged});
});

// signup route

app.get('/signup', function (req, res) {
    var msg = '';
    var isLogged = req.session.loggedin;
    res.render('pages/signup', {signup_error: msg, isLoggedIn: isLogged});
});

// upload photo routes

app.post('/upload-aurora', upload.single('aurora'), function (req, res, next) {
       
    
    //Think a if req.file = “” redirect to / and set vars as # should do it

   
    // req.file is the `photo` file
   // console.log("Uploaded aurora photo details" + req.file);
  //  console.log("Upload aurora photo filename" + req.file.filename);
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
    console.log('Aurora photo saved to database');
    });
    
    //saving observation in db
    var username = req.session.username;
    var long = req.body.long;
    var lat = req.body.lat;
    var ob_date = req.body.ob_date;
    var ob_time = req.body.ob_time;
    var photo_path = req.file.filename;
    
    
    var newObservation = {"username" : username, "latitude" : lat, "longitude" : long, "date": ob_date, "time": ob_time, "observation_photo" : photo_path};
    
    db.collection('observations').save(newObservation, function(err, result) {
    if (err) throw err;
    });

    res.redirect("/");
    
});

//registration form handler
app.post('/uploadProfile', upload.single('profile'), function (req, res, next) {
    
    var name = req.body.username;
    var password = req.body.password;
    var pass_conf = req.body.confirm_password;
    var email = req.body.email;
    var error_msg = '';
    var isLogged = req.session.loggedin;
    var if_observation = false;
    console.log("If Observation var" + if_observation);
    req.session.if_observation = if_observation;
    console.log("If Observation Req" + req.session.if_observation);

    
    if(name == '' || password == '' || email == '' || pass_conf==''){
        error_msg = 'Please provide all details';
                   res.render('pages/signup', {
                       signup_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
    }else{
        db.collection('profiles').findOne({'username':name}, function(err, result){
        if(err) throw err;
        if(result){
                 error_msg = 'The username already registered. Please try a different username';
                   res.render('pages/signup', {
                       signup_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
             }
            else if(pass_conf!=password){
                error_msg = 'Passwords entered must be identical';
                   res.render('pages/signup', {
                       signup_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
            }
            else{
                //save the photo
                // req.file is the `photo` file
                var photofile = req.file;
    
                if(photofile == null) {
                    error_msg = 'Please upload profile photo';
                   res.render('pages/signup', {
                       signup_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
                }
                
                else{
    // resize image to 128px width
    sharp(req.file.path)
                    .resize(128)
                    .toBuffer(function(err, buffer) {
        if (err) throw err;
        fs.writeFile(req.file.path, buffer, function(e) {
        });
    });
                //create new user and insert into database
                console.log("Upload Profile Photo filename" + req.file.filename);
                var user_details = {"username":name,"email":email,"password": password,"filename":req.file.filename};
                db.collection('profiles').save(user_details, function(err, result){
                    if(err) throw err;
                    res.redirect('/login');
                });

            }
            }
        });
    }
});

//login form handler
app.post('/dologin', function(req,res){
    var name = req.body.name;
    var password = req.body.password;
    var error_msg = '';
    var isLogged = req.session.loggedin;
    
    if(name == '' || password == ''){
        error_msg = 'Please enter your username and password';
                   res.render('pages/login', {
                       login_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
    }

    db.collection('profiles').findOne({'username':name}, function(err, result){
        if(err) throw err;
        if(!result){
                   error_msg = 'The username or password you entered are incorrect';
                   res.render('pages/login', {
                       login_error: error_msg,
                       isLoggedIn: isLogged
                   }); return;}
        if(result.password == password){
            req.session.loggedin = true; 
            req.session.username = result.username;

            console.log("This is the username:" + req.session.username);

            res.redirect('/');
        }else{
              error_msg = 'The username or password you entered are incorrect';
                   res.render('pages/login', {
                       login_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;}
        });
    });

//password change handler
app.post('/changePassword', function(req, res){
   var  newPass = req.body.newpassword;
   var newPassConf = req.body.confirmpassword;
    var isLogged = req.session.loggedin;
   var error_msg = '';
    
    console.log('test changePassword');
    
    if(newPass== '' || newPassConf == ''){
        console.log('fields missing');
        error_msg = 'Please enter new password';
                   res.render('pages/change-password', {
                       changepass_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
    }
    else if(newPass != newPassConf){
        console.log('passwords different');
        error_msg = 'Passwords do not match';
                   res.render('pages/change-password', {
                       changepass_error: error_msg,
                        isLoggedIn: isLogged
                   }); return;
    }
    else{
        var user = req.session.username;
        db.collection('profiles').updateOne(({"username": user}), ({$set: {"password": newPass}}), function(err, result){
            if (err) throw err;
            req.session.loggedin = false;
            res.redirect('/login');
        });
    }
});


//signout handler
app.get('/signout', function(req,res){
    req.session.loggedin = false;
    var isLogged = req.session.loggedin;
    req.session.username = null;
    res.redirect('/');
});



//map

app.get('/getObservations', function(req,res){
    db.collection('observations').find().toArray(function(err, result){
        if (err) throw err;
        console.log(("Get observation result" + result));
        res.send(result);
    });
    
});

//send information is the user logged in to the browser
app.get('/getIsLogged', function(req,res){
    var isLogged = false;
    if(req.session.loggedin==true){
        isLogged = true;
    }
    res.send(isLogged); 
});
