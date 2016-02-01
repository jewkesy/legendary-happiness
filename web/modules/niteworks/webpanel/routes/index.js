var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', id: req.query.id });
});

router.get('/mongo/gettweet/:id', function(req, res) {
	var db = req.db;
	db.collection('tweets').find({"twitter.id": parseInt(req.params.id)}).toArray(function (err, items) {
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


module.exports = router;
