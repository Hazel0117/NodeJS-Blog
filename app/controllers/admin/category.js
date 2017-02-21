var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = function(app) {
	app.use('/admin/categories',router);
};

router.get('/', function (req, res, next) {
  
});

router.get('/delete/:id', function(req,res,next) {
	Post.remove({_id: req.params.id}, function(err,post) {
		if (err) {
			return next(err);
		}
		if (post) {
			console.log('The article has been removed');
			res.redirect("/admin/posts");
		}
	});
});