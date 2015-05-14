'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JobSchema = new Schema({
  code 				: String,
  table_name		: String,
  query_string 		: String,
  description 		: String,
  frequency 		: String,
  primary_key 		: String
});

module.exports = mongoose.model('Job', JobSchema);