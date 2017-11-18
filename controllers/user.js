var express = require('express'), router = express.Router();

app.get('/', function(req, res) {
    res.json({"message": "Hello world - express!"});
});

router.get('/all', function(req, res) {
  var collection = db.get().collection('users');

  collection.find().toArray(function(err, docs) {
    res.json(JSON.stringify(docs));
  });
});

module.exports = router;
