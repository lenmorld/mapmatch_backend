// grab the things we need
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// create a Schema
var userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  interests: [String],
  lat: {
    type: SchemaTypes.Double
  },
  long: {
    type: SchemaTypes.Double
  },
});


// add methods for validations, formatting, etc

var User = mongoose.model('User', userSchema);

module.exports = User;

/*
// userid X
// username X
// email
// password
// firstname
// lastname
// gender
// lat
// long

*/
