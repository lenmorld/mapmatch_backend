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


// router.post('/search')


// router.options('/signup', cors()); // enable pre-flight request for DELETE request

router.post('/signup', function(req, res) {
  var collection = db.get().collection('users');

  if (req.body) {
    var body = req.body;

    // create User object
    var newUser = new User({
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password: body.password,
      gender: body.gender,
      lat: body.lat,
      long: body.long,
    });
    // call custom methods

    newUser.save(function(err) {
        if(err) throw err;

        res.json({"message": "Success"});
    });

    // collection.insert(req.body, function(err, result) {
    //   if (err)
    //     res.json({"message": "Error"});
    //   else {
    //     res.json({"message": "Success"});
    //   }
    // });
  }
});


router.post('/login', function(req, res) {
  var collection = db.get().collection('users');

  if (req.body) {
    collection.insert(req.body, function(err, result) {
      if (err)
        res.json({"message": "Error"});
      else {
        res.json({"message": "Success"});
      }
    });
  }
});


// userid, username remove

module.exports = router;
