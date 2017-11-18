var URL = 'mongodb://localhost:27017/dummyDB';
var express = require(express), app = express();

var db = require('./db');

db.connect(URL, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo');
    process.exit(1);
  } else {
    app.listen(3000, function() {

    })
  }
})
