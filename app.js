// App.js
  
var express = require("express"),
    mongoose = require("mongoose"),
    path = require('path'),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")

const User = require("./model/User");
const Demographics = require("./model/Demographics");
const Report = require("./model/Report");

var app = express();
var demo_obj_id = 'sample';

mongoose.connect("mongodb://127.0.0.1:27017/local");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(Demographics.authenticate()));
passport.serializeUser(Demographics.serializeUser());
passport.deserializeUser(Demographics.deserializeUser());

passport.use(new LocalStrategy(Report.authenticate()));
passport.serializeUser(Report.serializeUser());
passport.deserializeUser(Report.deserializeUser());
  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
  
// Showing profile page
app.get("/profile", isLoggedIn, function (req, res) {
    res.render("profile");
});
  
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
  
// Handling user signup
app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  });
  const demographics = await Demographics.create({
  username: req.body.username,
  password: req.body.password
  });
  res.render("home");
  // return res.status(200).json(user);
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});
  
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});
  
//Handling user login
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        const demographics = await Demographics.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            const uid = req.body.username;
            demo_obj_id = demographics._id;
            res.render("profile", {demographics : demographics});
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});
  
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
 
//showing edit page
app.get("/edit", async function (req, res) {
  const demographics = await Demographics.findOne({ _id : demo_obj_id});
  res.render("edit", {demographics : demographics});
});

//handling edit page data updation
app.post("/edit", async function(req, res){
  var demographics = await Demographics.updateOne({ _id : demo_obj_id},{
    username : req.body.username,
    password : req.body.password,
    name : req.body.pname,
    age : req.body.page,
    gender : req.body.pgender,
    dob : req.body.pdob,
    email : req.body.pemail,
    phone : req.body.pphone,
    address : req.body.paddress
  })
  demographics = await Demographics.findOne({ _id : demo_obj_id});
  res.render('profile', {demographics : demographics});
})

//showing take a test page
app.get("/test", function (req, res) {
  res.render("test");
});
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
  
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});