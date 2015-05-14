'use strict';

var express = require('express');
var controller = require('./manager.controller');

var router = express.Router();

router.get('/initialize', controller.initialize);
router.get('/run/:id', controller.force_run);

module.exports = router;