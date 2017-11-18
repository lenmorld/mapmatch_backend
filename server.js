var dbName = 'mapmatch';
var URL = 'mongodb://localhost:27017/' + dbName;
var express = require('express'), app = express();

var db = require('./db');

app.use('/users', require('./controllers/user'));


// connect to Mongo on server start
db.connect(URL, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo');
    process.exit(1);
  } else {
    const port = 9000;
    app.listen(port, function() {
      console.log('Listening on port ', port);
    })
  }
});
