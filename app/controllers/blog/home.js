var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.redirect('/posts');
});

router.get('/about', function (req, res, next) {
    res.render('blog/layout', {
      title: 'About me',
      content: 'I AM WHO?'
    });
});

router.get('/contact', function (req, res, next) {
    res.render('blog/layout', {
      title: 'Contact me',
      content: 'Email: lism0117@163.com'
    });
});