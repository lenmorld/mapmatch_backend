var express = require('express'), router = express.Router();

var db = require('../db');

router.get('/', function(req, res) {
    res.json({"message": "Hello world - express!"});
});

router.get('/all', function(req, res) {
  var collection = db.get().collection('users');

  collection.find().toArray(function(err, docs) {
    res.json(JSON.stringify(docs));
  });
});

router.post('/signup', function(req, res) {
  var collection = db.get().collection('users');

  collection.insert(req.body, function(err, result) {
    if (err)
      res.json({"message": "Error"});
    else
      res.json({"message": "Success"});
  });

});

// userid, username remove

module.exports = router;