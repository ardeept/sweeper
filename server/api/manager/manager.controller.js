'use strict';

var _       = require('lodash');
var mysql   = require('mysql');
var TPS     = require('tps-monitor');
var config  = require('../../config/environment');

var Job = require('../job/job.model');


var Runner = function(job)
{
  var self    = this;
  var tps     = new TPS();


  
  self.init = function()
  {
      // initialize job status
      job.status          = "CONNECTING";
      job.error           = {};
      job.save();

      // connect to DB

      

      config.mysql.connectTimeout = 10000; // 10 seconds timeout

      console.log("Runner","connecting to",config.mysql);
      self.connection_write = mysql.createConnection(config.mysql);
      self.connection_write.connect(function(err){


        if(err)
        { 
            job.status          = "ERROR";
            job.error           = err;

            return false;
        }


        console.log("Connected", config.mysql.host);
         // is there a slave?
        if(config.mysql_slave)
        {
          

          config.mysql_slave.connectTimeout = 10000; // 10 seconds timeout

          console.log("Runner","connecting to slave",config.mysql_slave);
          self.connection_read = mysql.createConnection(config.mysql_slave);
          self.connection_read.connect(function(err){
            if(err)
            {
                // cant connect to the slave
                // use the master as the read
                self.connection_read = self.connection_write;       
            }
            else
            {
              console.log("Connected", config.mysql_slave.host);
            }
          });
        }
        else
        {
          self.connection_read = self.connection_write;
        }




        // ensure that all required tables are available

        self.ensure_tables(function(err){
          if(err)
          {
              job.status          = "ERROR";
              job.error           = err;
              job.save();
          }
          else
          {
            job.status          = "RUNNING";
            job.rows_read       = 0;
            job.date_started    = new Date();
            job.save();

            self.run();
          }
        });
      });
  }

  

  self.run = function()
  {
    console.log("STARTED " + job.id);

    self.select_query       = self.connection_read.query('SELECT * FROM ' + job.table_name + ' where ' + job.query_string);
    self.read_rows          = 0;

    self.select_query
      .on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
        console.log("ERROR RUNNING " + self.query + " " + job.id, err);

        job.error      = err;
      })
      .on('fields', function(fields) {
        // the field packets for the rows to follow
      })
      .on('result', function(row) {
          self.read_rows++;

          var delete_query   = 'DELETE  FROM  ' + job.table_name + ' where ' + job.primary_key + '=' + row[job.primary_key];

          if(job.archive_table_name)
          {
            var insert_query   = 'INSERT into  ' + job.archive_table_name + ' set ? ';

            self.connection_write.query(insert_query, row, function(err, result){
                         
            });
          }
          
          if(config.live_delete)
          {
            self.connection_write.query(delete_query);
          }
          
         

          job.rows_read++;
          job.tps =  tps.update();

          job.save();
      })
      .on('end', function() {
        // all rows have been received
        console.log("ENDED " + job.id, "TPS : " + tps.update());

        job.date_ended      = new Date();
        job.status          = "COMPLETED";
        job.save();
      });
  }

  self.ensure_tables = function(cb)
  {
      self.connection_write.query("DESCRIBE " + job.table_name, function(err, data){
        if(err)
        {
          cb(job.table_name + " doesn't exist");
        }
        else
        {
            // console.log(data);
            // is there an archive table?
            if(job.archive_table_name)
            {
                  self.connection_write.query("DESCRIBE " + job.archive_table_name, function(err, data){
                    if(err)
                    {
                        // table doesn't exist, creat it
                        self.connection_write.query("create table " + job.archive_table_name + " like " + job.table_name, function(err, data){
                            if(err)
                            {
                                cb(err);
                            }
                            else
                            {
                                cb();
                            }
                        });

                    }
                    else
                    {
                        cb();
                    }
                });
            }
            else
            {
               cb();
            }
        }
      });
  }

  self.error = function(err)
  {
      self.error = err;
  }

  self.init();

  
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

  res.send("RUNNING " +  id);

  run_query(id);
}


exports.get_config = function(req, res)
{

  var r = {
    master : {
      hostname : config.mysql.host,
      user    : config.mysql.user,
    },
    slave : {
      hostname : config.mysql_slave.host,
      user    : config.mysql_slave.user,
    },
    platform : config.platform
  }

  res.json(r);
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