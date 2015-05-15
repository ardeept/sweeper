'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JobSchema = new Schema({
  code 				: String,
  table_name		: String,
  query_string 		: String,
  description 		: String,
  frequency 		: String,
  primary_key 		: String,
  rows_read 		: { type : Number, default : 0 },
  status 			: { type : String, default : "IDLE" },
  date_created		: Date,
  date_started		: Date,
  date_ended 		: Date,
  error				: {},
  archive_table_name : String,
  tps 				: { type : Number, default : 0 }
});

module.exports = mongoose.model('Job', JobSchema);