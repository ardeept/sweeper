'use strict';

var _       = require('lodash');
var mysql   = require('mysql');
var TPS     = require('tps-monitor');
var config  = require('../../config/environment');

var Job = require('../job/job.model');

var connection = mysql.createConnection(config.mysql);
connection.connect();


var Runner = function(job)
{
  var self    = this;
  
  var tps     = new TPS();
  self.select_query      = connection.query('SELECT * FROM ' + job.table_name + ' where ' + job.query_string);
  
  self.read_rows  = 0;


  self.select_query
    .on('error', function(err) {
      // Handle error, an 'end' event will be emitted after this as well
      console.log("ERROR RUNNING " + self.query + " " + job.id, err);
    })
    .on('fields', function(fields) {
      // the field packets for the rows to follow
    })
    .on('result', function(row) {
        self.read_rows++;

        var delete_query   = 'DELETE  FROM  ' + job.table_name + ' where ' + job.primary_key + '=' + row[job.primary_key];
        // connection.query(delete_query);

        tps.update();

        // console.log();
    })
    .on('end', function() {
      // all rows have been received
      console.log("ENDED " + job.id, "TPS : " + tps.update());
    });
}



exports.initialize = function(req, res)
{
  load_jobs(function(){
    console.log("Jobs loaded");

    res.send("Jobs loaded");
    run();
  });
}

exports.force_run = function(req, res)
{
  var id = req.params['id'];

  run_query(id);

  res.send("RUNNING " +  id);

}

function run()
{
  console.log("run");
  // for every hour, check the jobs
  setInterval(check_jobs, 1000 * 3600);
}

function run_query(id)
{
  console.log("run_query",id);
  Job.findById(id, function(err, job){
    if(job)
    {
      var r = new Runner(job);
    }
  });
}

function check_jobs()
{
  console.log("check_jobs");
  Job.find({}, function(err, jobs){
    console.log("FOUND ", jobs.length, jobs);

    _.each(jobs, function(v){

      // if this is hourly job, and interval is running every hour, then run this
      if(v.frequency == 'hourly')
      {
        run_query(v._id);
      }
      // if this is daily and current hour is 00:00
      else if(v.frequency == 'daily' && new Date().getHours() == 0)
      {
        run_query(v._id)
      }
      else
      {
        // nothing to do here
      }
    });
  });
}

function load_jobs(cb)
{
  // clear all jobs
  Job.find({}).remove(function(){
    // load the jobs from config
    _.each(config.jobs, function(v){
        var j = new Job(v);

        console.log("Loading ", j.id);
        j.save();
    });

    cb();
  });

  
}

function run_test()
{

}


function connect_db()
{
  // connect to the database

  

  

}

function handleError(res, err) {
  return res.send(500, err);
}