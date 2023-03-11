// User.js
  
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var Demographics = new Schema({
    name: String,
    email: String,
    gender : String,
    dob: String,
    phone: Number,
    address: String,
    age: Number,
    username: String,
    password: String
})
  
Demographics.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Demographics', Demographics)