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
  User.find({}, function(err, users) {
    if(err) {
      res.json({"message": err});
    }
    res.json({"users": users});
  });
});

function checkMatch(arr1, arr2) {
  console.log(arr1, arr2);
  // console.log(arr1 === arr2);
  // if (arr1 && arr2)
  // console.log(arr1[0], arr2[0]);

  if(!arr1 || !arr2) {
    return false;
  }

  if(!arr1.length || !arr2.length)
  {
    return false;
  }

  // take care of android compatibilities
  // ["null"]
  if (arr1[0] === "null" || arr2[0] === "null")
  {
    return false;
  }

  // ["[rockclimbing, bowing]"], ["[rockclimbing]"]
  // => ["rockclimbing, bowling"]
  if (arr1[0][0] === "[") {
    arr1 = arr1[0].replace("[", "").replace("]", "").split(",");
    console.log(arr1);
  }
  if (arr2[0][0] === "[") {
    arr2 = arr2[0].replace("[", "").replace("]", "").split(",");
    console.log(arr2);
  }



  // console.log("arr2 includes: arr1[0]", arr2.includes(arr1[0]));

  for(var i=0; i< arr2.length; i++) {
    arr2[i] = arr2[i].trim().toUpperCase();
  }

  for(var i=0; i< arr1.length; i++) {
    arr1[i] = arr1[i].trim().toUpperCase();
  }

  console.log(arr1, arr2);

  for(var i=0; i< arr1.length; i++) {
    // console.log("item:", arr1[i]);

    if (arr2.includes(arr1[i])) {
      return true;
    }
  }

  return false;
}

router.post('/', function(req, res) {
  console.log("FIND MATCH req: ", req.body);
  // save this, if its not here yet
  User.findOne({ email: req.body.email }, function(err, source) {
    console.log("user looking for match: ", source);
    if(err) {
      res.json({"message": err});
    }

    if(source) {
      // save interests, music, movies or update them

      var newUser;
      var lookingForGender = req.body.gender;

      User.findOneAndUpdate({ email: req.body.email },    // find this
        { interests: req.body.interests, movies: req.body.movies,
          music: req.body.music  },       // update these fields
          {new: true},                                     // return updated instead of old
          function(err, user) {                             // callback
            if(err) {
              res.json({"message": "User not found: " + err});
              return;
            }
            newUser = user;
            // res.json({"user": user});
            console.log("Updated user: ", newUser);
            console.log("---loking for: ", lookingForGender, req.body.interests, req.body.movies, req.body.music);

            // get nearby users
            User.find({}, function(err, destUsers) {
              if(err) {
                res.json({"message": err});
              }
              // console.log("all users: ", destUsers);
              var nearbyUsers = [];
              for(var i=0; i< destUsers.length; i++) {
                var dUser = destUsers[i];
                // dont for itself
                if (dUser.email === newUser.email) {
                  continue;
                }

                var distance = geolib.getDistance(
                  {latitude: geolib.useDecimal(newUser.lat.value), longitude: geolib.useDecimal(newUser.long.value)},
                  {latitude: geolib.useDecimal(dUser.lat.value), longitude: geolib.useDecimal(dUser.long.value)}
                );

                // console.log("distance", distance);
                if (distance <= DISTANCE) {
                  nearbyUsers.push(dUser);
                }
              }
              console.log("nearby users to ", source.email ,":" , nearbyUsers);
              // res.json({"users": nearbyUsers});
              // match user's interests array with nearbyUser's arrays
              var compatibleNearbyUsers = [];
              for(var i=0; i< nearbyUsers.length; i++) {
                var nearby = nearbyUsers[i];
                console.log("nearby: ", nearby);
                console.log(newUser.interests, nearby.interests);
                if (lookingForGender === nearby.gender &&
                  checkMatch(newUser.interests, nearby.interests,newUser.music, nearby.music) ||
                  checkMatch(newUser.music, nearby.music) ||
                  checkMatch(newUser.movies, nearby.movies))
                  {
                    // MATCH!
                    compatibleNearbyUsers.push(nearby);
                    console.log("compatible [" , newUser.email , "," , nearby.email, "]: ", true);
                  }
                  else {
                    console.log("compatible [" , newUser.email , "," , nearby.email, "]: ", false);
                  }
                }
                res.json({"users": compatibleNearbyUsers});
              });
            });
          } else {
            res.json({"message": "User not found"});
          }
        });
      });


      router.post('/search', function(req, res) {
        // check distance between this user and other users
        console.log("SEARCH req: ", req.body);

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
              // console.log("all users: ", destUsers);
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
        console.log("LOGIN req: ", req.body);
        if (req.body) {
          User.findOne({ email: req.body.email, password: req.body.password }, function(err, user) {
            console.log(user);
            if(err) {
              res.json({"message": err});
            }

            if(user) {
              res.json({"auth": true, "user": user});
            } else {
              // not found
              res.json({"auth": false});
            }
          });
        }
      });

      router.post('/update', function(req, res) {
        console.log("UPDATE req: ", req.body);
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
            });
          }
        });

        // router.options('/signup', cors()); // enable pre-flight request for DELETE request

        router.post('/signup', function(req, res) {
          // var collection = db.get().collection('users');
          console.log("SIGNUP req: ", req.body);
          if (req.body) {
            var body = req.body;

            // var interests1 = req.body.interests.map((i) => i);

            // create User object
            var newUser = new User({
              firstname: body.firstname,
              lastname: body.lastname,
              email: body.email,
              // interests: body.interests,
              // movies: body.movies,
              // music: body.music,
              password: body.password,
              gender: body.gender,
              lat: body.lat,
              long: body.long,
            });
            // call custom methods

            // mongoose - save function
            newUser.save(function(err) {
              if(err) {
                res.json({"message": err});
                // throw err;
              }else {
                res.json({"message": "Success"});
              }
            });

            // Pure Mongo - insert
            // collection.insert(req.body, function(err, result) {
            //   if (err)
            //     res.json({"message": "Error"});
            //   else {
            //     res.json({"message": "Success"});
            //   }
            // });
          }
        });

        //
        // router.post('/login', function(req, res) {
        //   var collection = db.get().collection('users');
        //
        //   if (req.body) {
        //     collection.insert(req.body, function(err, result) {
        //       if (err)
        //         res.json({"message": "Error"});
        //       else
        //         res.json({"message": "Success"});
        //     });
        //   }
        // });

        module.exports = router;
