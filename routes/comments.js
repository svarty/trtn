var express = require("express");
var router = express.Router({mergeParams:true});
var Gym = require("../models/gym");
var Comment = require("../models/comment");

// NEW COMMENTS
router.get('/new', function(req, res){
	Gym.findById(req.params.id, function(err, gyms){
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {gyms: gyms});
		}
	});
});


//COMMENTS CREATE

router.post('/', function(req, res){
	Gym.findById(req.params.id, function(err, gyms){
		if(err){
			console.log(err);
			res.redirect('/index');
		} else {
			Comment.create(req.body.comment, function(err, comment){
				comment.author.id = req.user._id;
               	comment.author.username=req.user.username

				comment.save();
				gyms.comments.push(comment);
				gyms.save();
				res.redirect('/index/' + gyms._id);
			})
		}
	})
})


// Middleware
function isLoggedIn (req, res, next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;