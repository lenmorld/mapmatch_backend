var dbName = 'mapmatch';
var URL = 'mongodb://localhost:27017/' + dbName;
var express = require('express'), app = express();
var bodyParser = require('body-parser');

var db = require('./db');

app.use(bodyParser.json());

/* CORS */
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
var cors = require('cors')

app.use(cors());

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
