var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = function(app) {
	app.use('/admin',router);
};

router.get('/',function(req,res,next) {
	Post.find(function(err,posts) {
		if (err) {return next(err);}
		res.render('admin/index', {
			title: 'Lisimin',
			posts: posts
		});
	});
});

