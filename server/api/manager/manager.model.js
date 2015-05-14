'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ManagerSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Manager', ManagerSchema);