// apiid from where metatags are extracted
var apiid = process.env.APIID;
// express router configuration
var express = require("express");
var router  = express.Router();
// require npm packages
var request = require("request");
// require models
var Mark = require("../models/Mark.model");
var User = require("../models/User.model");
// require middleware
var middleware = require("../middleware");
// route to show marks of current user
router.get("/marks", middleware.isLoggedIn, function(req, res){
    Mark.find({"owner": req.user._id}, function(err, marks){
        if(err){
            console.log(err);
        } else {
            res.render("index", {marks: marks, currentUser: req.user}); 
        }
    });
});
// route to post new mark
router.post("/marks", function(req, res){
    // target url to fetch data from api
    var tar="http://api.linkpreview.net/?key="+apiid+"&q="+req.body.mark.url;
    // request from api
    request(tar, function(error, response, body){
        if(!error && response.statusCode==200){
            // convert parsed data into json format
            var parsedData=JSON.parse(body);
            // create new mark to database
            Mark.create(
                {
                    title: parsedData["title"],
                    description: parsedData["description"],
                    image: parsedData["image"],
                    url: parsedData["url"],
                    owner: req.user._id
                }, function(err, newMark){
                    if(err){
                        console.log(err);
                    } else {
                        res.redirect("/marks");
                    }
            });
        }
    }); 
});
// route to delete mark by its id
router.delete("/marks/:id", function(req, res){
    Mark.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
       } else {
            res.redirect("/marks");
       }
    });
});
// export express router to use in main app
module.exports = router;