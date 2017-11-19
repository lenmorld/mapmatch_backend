var express = require('express');
var app = express();

app.get('/', function(req, res) {
        res.send('Hello world - express!\n');
});

var port = 9000;
app.listen(port);
console.log("MAPMATCH running on ", port);



=================


var MongoClient = require('mongodb').MongoClient;

var URL = 'mongodb://localhost:27017/dummyDB';

MongoClient.connect(URL, function(err, db) {
        if(err) return;

        var collection = db.collection('dummyDB');
        collection.find().toArray(function(err, docs) {
                console.log(docs[0]);
                db.close();
        });

});


=====

var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://localhost:27017/dummyDB';

app.get('/', function(req, res) {
        res.send('Hello world - express!\n');
});

app.get('/dbtest', function(req, res) {
  MongoClient.connect(URL, function(err, db) {
          if(err) return;

          var collection = db.collection('dummyDB');
          collection.find().toArray(function(err, docs) {
                  console.log(docs[0]);
                  res.send(docs[0]);
                  db.close();
          });
  });
});


app.get('/signup', function(req, res) {

});

app.get()





// login
// signup
//

// userid
// username
// email
// password
// firstname
// lastname
// gender



var port = 9000;
app.listen(port);
console.log("MAPMATCH running on ", port);
