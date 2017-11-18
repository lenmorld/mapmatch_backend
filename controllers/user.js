var express = require('express'), router = express.Router();
var db = require('../db');
var User = require('../models/User');

var geolib = require('geolib');

var googleMapsClient = require('@google/maps')
  .createClient({
    key: 'AIzaSyDvHC-6iyFfVycoK201MoXPjlkVsU01XAc'
  });


const DISTANCE = 1000;



// var cors = require('cors');

// router.get('/', function(req, res) {
//     res.json({"message": "Hello world - express!"});
// });

router.get('/', function(req, res) {
  // var collection = db.get().collection('users');

  User.find({}, function(err, users) {
    if(err) {
      res.json({"message": err});
    }
    res.json({"users": users});
  });

  // collection.find().toArray(function(err, docs) {
  //   res.json(JSON.stringify(docs));
  // });
});


router.post('/search', function(req, res) {
  // check distance between this user and other users

  // get user
  User.findOne({ email: req.body.email }, function(err, source) {
    console.log(source);
    if(err) {
      res.json({"message": err});
    }

    if(source) {
      // get all other users
      User.find({}, function(err, destUsers) {
        if(err) {
          res.json({"message": err});
        }
        console.log("all users: ", destUsers);

        var nearbyUsers = [];

        for(var i=0; i< destUsers.length; i++) {
          // console.log(source.lat, source.long, dUser.lat, dUser.long);

          var dUser = destUsers[i];

          // dont for itself
          if (dUser.email === source.email) {
            continue;
          }

           var distance = geolib.getDistance(
                {latitude: geolib.useDecimal(source.lat.value), longitude: geolib.useDecimal(source.long.value)},
                {latitude: geolib.useDecimal(dUser.lat.value), longitude: geolib.useDecimal(dUser.long.value)}
            );

            // console.log("distance", distance);
            if (distance <= DISTANCE) {
              nearbyUsers.push(dUser);
            }
        }

        res.json({"users": nearbyUsers});

      });
    } else {
      // not found
      res.json({"message": "User not found"});
    }
  });

});

router.post('/login', function(req, res) {
  if (req.body) {
    User.findOne({ email: req.body.email, password: req.body.password }, function(err, user) {
      console.log(user);
      if(err) {
        res.json({"message": err});
      }

      if(user) {
        res.json({"auth": true, "user": user.email});
      } else {
        // not found
        res.json({"auth": false});
      }
    });
  }
});

router.post('/update', function(req, res) {
  // email, lat, long
  if (req.body) {
    // find user with given email
    User.findOneAndUpdate({ email: req.body.email },    // find this
      { lat: req.body.lat, long: req.body.long },       // update these fields
       {new: true},                                     // return updated instead of old
      function(err, user) {                             // callback
        if(err) {
          res.json({"message": err});
        }
        res.json({"user": user});
      })
  }
});

// router.options('/signup', cors()); // enable pre-flight request for DELETE request

router.post('/signup', function(req, res) {
  // var collection = db.get().collection('users');
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
        if(err) {
          res.json({"message": err});
          // throw err;
        }
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
