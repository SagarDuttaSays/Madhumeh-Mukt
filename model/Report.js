// User.js
  
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var Report = new Schema({
    pregnancy: Number,
    glucose: Number,
    bloodpressure: Number,
    skinthickness: Number,
    insulin: Number,
    bmi: Number,
    diabetespedgreefunction: Number,
    age: Number
})
  
Report.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Report', Report)