
//随机生成文章数据
var loremipsum = require('lorem-ipsum'),
  slug = require('slug'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

User.findOne(function(err,user) {
	if (err) {
		throw err;
	}

	Category.find(function(err,categories) {
		if (err) {
			return console.log('wrong with categories');
		}
		categories.forEach(function(category) {
			for(i = 0; i < 50; i++) {
				var title = loremipsum({count:1, units:'sentence'});
				var post = new Post({
					title: title,
					slug: slug(title),
					content: loremipsum({count:50, units:'sentence'}),
					category : category,
					author: user,
					published: true,
					meta: {favarites:0},
					comments:[],
					created: new Date()
				});

				post.save(function(err,post) {
				console.log('has been saved');
				});
			}
		});
	});
});