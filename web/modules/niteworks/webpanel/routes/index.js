var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tweet', id: req.query.id });
});

router.get('/tags', function(req, res, next) {
  res.render('tags', { title: 'Tags'});
});

router.get('/autoload', function(req, res, next) {
  res.render('autoload', { title: 'Auto Load'});
});

router.get('/alltweets', function(req, res, next) {
  res.render('alltweets', { title: 'All Tweets'});
});

router.get('/mongo/gettweet/:id', function(req, res) {
	var db = req.db;
	db.collection('tweets').find({"twitter.id": parseInt(req.params.id)}).toArray(function (err, items) {
		if (err) console.log(err)
		res.json(items);
	});
});

router.get('/mongo/getalltweets', function(req, res) {
	var db = req.db;
	db.collection('newtweets').find({}).toArray(function (err, items) {
		if (err) console.log(err)
		res.json(items);
	});
});

router.get('/mongo/gettweetuser/:id', function(req, res) {
	var db = req.db;
	

	db.collection('tweets').find({"twitter.user.id": parseInt(req.params.id)}).toArray(function (err, items) {
		if (err) console.log(err)
		res.json(items);
	});
});

router.get('/mongo/gettagcounts', function(req, res) {
	var db = req.db;
	

	db.collection('tagCount').find({}).toArray(function (err, items) {
		if (err) console.log(err)
		res.json(items);
	});
});

router.get('/mongo/getkeywordcounts', function(req, res) {
	var db = req.db;
	

	db.collection('keywords').find({}).toArray(function (err, items) {
		if (err) console.log(err)
		res.json(items);
	});
});

router.post('/mongo/savetweet', function(req, res) {
	var db = req.db;
	

	db.collection('newtweets').insert(req.body, function(err, result){
		if (err) console.log(err)
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

router.get('/twitter/getuser/:screenname', function(req, res) {
	var params = {screen_name: req.params.screenname};
	var client = req.client;
	client.get('users/show', params, function(error, tweets, response){
	  if (!error) {
	    res.json(tweets);
	  }
	});
});

router.get('/twitter/getusertimeline/:screenname', function(req, res) {
	var params = {screen_name: req.params.screenname};
	var client = req.client;
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	    res.json(tweets);
	  }
	});
});

router.get('/twitter/getuserfriends/:screenname', function(req, res) {
	var params = {screen_name: req.params.screenname};
	var client = req.client;
	client.get('friends/ids', params, function(error, tweets, response){
	  if (!error) {
	    res.json(tweets);
	  }
	});
});

router.get('/twitter/gettweets/:maxid', function(req, res) {
	var params = {geocode: '33.5000,36.3000,12000km', count:100, max_id:parseInt(req.params.maxid)};
	var client = req.client;
	client.get('search/tweets', params, function(error, tweets, response){
	  if (!error) {
	    res.json(tweets);
	  }
	});
});


module.exports = router;
