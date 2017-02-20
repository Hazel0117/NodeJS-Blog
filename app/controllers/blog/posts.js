var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/posts', router);
};

router.get('/', function (req, res, next) {
  Post.find({published:true})
  .sort('created')
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
    res.render('blog/index', {
      posts:posts.slice((pageNum - 1)*pageSize,pageNum*pageSize),
      pretty:true,
      pageNum:pageNum,
      pageCount:pageCount
    }
    );
  });
});

router.get('/category/:name', function (req, res, next) {
    Category.findOne({name:req.params.name},function(err,category) {
      if (err) {return next(err);}
      Post.find({category:category})
      .sort('created')
      .populate('author')
      .populate('category')
      .exec(function(err,posts) {
      if (err) return next(err);
      var pageNum = Math.abs(parseInt(req.query.page || 1));
      var pageSize = 10;
      var totalCount = posts.length;
      var pageCount = Math.ceil(totalCount/pageSize);
      if (pageNum > pageCount) {
        pageNum = pageCount;
      }
      res.render('blog/category.jade', {
        posts:posts.slice((pageNum - 1)*pageSize,pageNum*pageSize),
        pretty:true,
        pageNum:pageNum,
        pageCount:pageCount,
        title: category
      }
    );
      });
    });
});

router.get('/view/:id', function (req, res, next) {
  Post.findOne({_id:req.params.id})
  .populate('author')
  .populate('category')
  .exec(function(err,post) {
    if (err) {
      return next(err);
    }
    res.render('blog/view.jade', {
      post:post,
      pretty:true
    });
  }); 
});

router.post('/view/:id',function(req,res,next) {
  Post.update({_id:req.params.id},{$inc:{"meta.favarites":1}},function(err,post){
    if (err) {
      return console.log(err);
    }
    console.log('update success');
    Post.findOne({_id:req.params.id},function(err,post) {
    res.json(post.meta.favarites);
    });
  });     
});

router.post('/comment/:id',function(req,res,next) {
  if (!req.body.email) {
      return next(new Error('no email is provided'));
    }
  if (!req.body.content) {
      return next(new Error('no content is provided'));
    }
  Post.findOne({_id:req.params.id}, function(err,post) {
    if (err) {
      return next(err);
    }
    var comment = {
      email:req.body.email,
      content:req.body.content
    };
    post.comments.unshift(comment);
    post.markModified(post.comments);
    post.save(function(err,post) {
      res.redirect('/posts/view/' + post._id);
    });  
  });
});




