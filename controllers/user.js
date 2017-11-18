var express = require('express'), router = express.Router();
var db = require('../db');
var User = require('../models/User');

var googleMapsClient = require('@google/maps')
.createClient({
  key: 'AIzaSyDvHC-6iyFfVycoK201MoXPjlkVsU01XAc'
});


const DISTANCE = 1;



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

function getDistance(source, dest) {
  // look for people in 1km radius
  // console.log(googleMapsClient);

  console.log("source coords:", source.lat.value, source.long.value);
  console.log("dest coords:", dest.lat.value, dest.long.value);

  // get distance.
  googleMapsClient.distanceMatrix({
    origins: [source.lat.value,source.long.value].join(","),
    destinations: [dest.lat.value,dest.long.value].join(","),
    // origins: "43.009953,-81.273613",
    // destinations: "43.012372,-81.274601",
    mode: "walking"
  }, function(err, response) {
    if (!err) {
      /*
      {"destination_addresses":["10 Perth Dr, London, ON N6G 2V4, Canada"],
      "origin_addresses":["1960 Middlesex Dr, London, ON N6G 2V4, Canada"],
      "rows":[{"elements":[{"distance":{"text":"0.4 km","value":418},"duration":{"text":"5 mins","value":309},"status":"OK"}]}],"status":"OK"}
      */
      // console.log(response);
      console.log(JSON.stringify(response.json.rows[0].elements[0].distance.text).split(" ")[0]);
      var distance = Number(JSON.stringify(response.json.rows[0].elements[0].distance.text).split(" ")[0].split('"')[1]);    // 0.4

      // var duration = response.json.rows[0].elements[0].duration;
      return distance;
    }
    else {
      return NaN;      // error
    }
  });
}

// getNearbyUsers() {
//
// }
//
// {"destination_addresses":["10 Perth Dr, London, ON N6G 2V4, Canada"],
// "origin_addresses":["1960 Middlesex Dr, London, ON N6G 2V4, Canada"],
// "rows":[{"elements":[{"distance":{"text":"0.4 km","value":418},"duration":{"text":"5 mins","value":309},"status":"OK"}]}],"status":"OK"}

router.post('/search', function(req, res) {
  // check distance between this user and other users

  // get user
  User.findOne({ email: req.body.email }, function(err, source) {
    if(err) {
      res.json({"message": err});
    }

    if(source) {
      // get all other users
      User.find({}, function(err, users) {
        if(err) {
          res.json({"message": err});
        }
        console.log("all users: ", users);



        var nearbyUsers = [];
        /********** ASYNC GOOGLE MAPS *******/
        for(var i=0; i<users.length;i++) {
          var dest = users[i];
          // var distance = getDistance(user, destUser);

          var promise = new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
            // get distance.
            googleMapsClient.distanceMatrix({
              origins: [source.lat.value,source.long.value].join(","),
              destinations: [dest.lat.value,dest.long.value].join(","),
              // origins: "43.009953,-81.273613",
              // destinations: "43.012372,-81.274601",
              mode: "walking"
            }, function(err, response) {
              if (!err) {
                /*
                {"destination_addresses":["10 Perth Dr, London, ON N6G 2V4, Canada"],
                "origin_addresses":["1960 Middlesex Dr, London, ON N6G 2V4, Canada"],
                "rows":[{"elements":[{"distance":{"text":"0.4 km","value":418},"duration":{"text":"5 mins","value":309},"status":"OK"}]}],"status":"OK"}
                */
                // console.log(response);
                var distance = Number(JSON.stringify(response.json.rows[0].elements[0].distance.text).split(" ")[0].split('"')[1]);    // 0.4
                console.log("distance", distance);

                if (distance <= DISTANCE ) {
                  console.log("This user is nearby: ", dest);
                }
                // var duration = response.json.rows[0].elements[0].duration;
                // return distance;
                resolve(destUser);
              } else {
                reject(Error("It broke"));    // reject promise
              }
            });
          }

          // console.log("distance: ", distance);
          // if (!isNaN(distance) && distance < DISTANCE ) {
          //   console.log("This user is nearby: ", dest);
          //   nearbyUsers.push(destUser);
          // }

          // everything turned out
          promise.then(function(result) {
            console.log("promise_nearby: ", result); // "Stuff worked!"
            nearbyUsers.push(result);
            res.json({"users": nearbyUsers});
          }, function(err) {
            console.log(err); // Error: "It broke"
            // res.json({"users": null, "message": err});
          });
        }
        // console.log("users: ", nearbyUsers);
        // resolve(nearbyUsers);
      });

      res.json({"users": nearbyUsers})

      // var nearbyUsers = users.map(function((user) {return getDistance(user.lat, user.long) }));
      // res.json({"users": nearbyUsers});
    });
  } else {
    // not found
    res.json({"message": "User not found"});
  }
});

//https://maps.googleapis.com/maps/api/distancematrix/json?
// origins=43.009953,-81.273613&
// destinations=43.012372,-81.274601&
// mode=walking&
// key=AIzaSyDvHC-6iyFfVycoK201MoXPjlkVsU01XAc

});

router.post('/login', function(req, res) {
  if (req.body) {
    User.findOne({ email: req.body.email, password: req.body.password }, function(err, user) {
      console.log(user);
      if(err) {
        res.json({"message": err});
      }

      if(user) {
        res.json({"auth": true});
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
