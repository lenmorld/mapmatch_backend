var express = require('express'), router = express.Router();

var db = require('../db');
// var cors = require('cors');

router.get('/', function(req, res) {
    res.json({"message": "Hello world - express!"});
});

router.get('/all', function(req, res) {
  var collection = db.get().collection('users');

  collection.find().toArray(function(err, docs) {
    res.json(JSON.stringify(docs));
  });
});


// router.options('/signup', cors()); // enable pre-flight request for DELETE request

router.post('/signup', function(req, res) {
  var collection = db.get().collection('users');
  console.log(req.body);
  console.log(res);

  collection.insert(req.body, function(err, result) {
    if (err)
      res.json({"message": "Error"});
    else {
      res.json({"message": "Success", "datasent": res});
    }
  });

});

// userid, username remove

module.exports = router;
