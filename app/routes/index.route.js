// express router configuration
var express = require("express");
var router  = express.Router();
// require npm packages
var passport = require("passport");
var request = require("request");
// require models
var Mark = require("../models/Mark.model");
var User = require("../models/User.model");
// require middleware
var middleware = require("../middleware");
// root route
router.get("/", function(req, res){
    res.redirect("/marks"); 
});
// route to signup form
router.get("/signup", middleware.isAlreadyLoggedIn, function(req, res){
    res.render("signup"); 
});
// route to post signup form data to database and register user
router.post("/signup", function(req, res){
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
    	if(err){
            // if signup fails then redirect to signup form again
    		console.log(err);
    		return res.render("signup");
    	} else {
            // if signup success then redirect to signin
    		passport.authenticate("local")(req, res, function(){
    			res.redirect("/signin");
    		});
    	}
    });
});
// route to signin form
router.get("/signin", middleware.isAlreadyLoggedIn, function(req, res){
	res.render("signin");
});
// route to post signin form data
router.post("/signin", passport.authenticate("local",
	{
		successRedirect: "/marks", // if signin success redirect to /marks route
		failureRedirect: "/signin" // if sigin fails redirect to /signin route
	}), function(req, res){
});
// route to signout
router.get("/signout", middleware.isLoggedIn, function(req, res){
	req.logout();
	res.redirect("/signin");
});
// export express router to use in main app
module.exports = router;