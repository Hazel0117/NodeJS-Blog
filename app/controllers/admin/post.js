var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var slug = require('slug');
var User = mongoose.model('User');

module.exports = function(app) {
	app.use('/admin/posts',router);
};

router.get('/', function (req, res, next) {

  //how to sort the articles
  var sortby = req.query.sortby ? req.query.sortby : 'created';
  var sortdir = req.query.sortby ? req.query.sortdir : 'desc';
  if (['title','category','author','created'].indexOf(sortby) === -1) {
    sortby = 'created';
  }
  if (['desc','asc'].indexOf(sortdir) === -1) {
    sortdir = 'desc';
  }
  var sortObj = {};
  sortObj[sortby] = sortdir;


  Post.find({published:true})
  .sort(sortObj)
  .populate('author')
  .populate('category')
  .exec(function (err, posts) {
    if (err) return next(err);
    var pageNum = Math.abs(parseInt(req.query.page || 1));
    var pageSize = 10;
    var totalCount = posts.length;
    var pageCount = Math.ceil(totalCount/pageSize);
    if (pageNum > pageCount) {
      pageNum = pageCount;
    }
    res.render('admin/post/index', {
      posts:posts.slice((pageNum - 1)*pageSize,pageNum*pageSize),
      pretty:true,
      pageNum:pageNum,
      pageCount:pageCount,
      sortdir:sortdir,
      sortby:sortby
    }
    );
  });
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

router.get('/add',function(req,res,next) {
    res.render('admin/post/add');

});
router.post('/add',function(req,res,next) {
    var title = req.body.title.trim();
    var category = req.body.category.trim();
    var content = req.body.content;

    User.findOne({}, function(err,author) {
      var post = new Post({
        title: title,
        slug: slug(title),
        category: category,
        content: content,
        author: author,
        created: new Date(),
        published: true,
        meta: {favarites: 0},
        comments: []
      });

      post.save(function(err,post) {
        if (err) {
          res.redirect('/admin/posts');
          return next(err);
        }
        res.redirect('/admin/posts');
      });
    });

});

