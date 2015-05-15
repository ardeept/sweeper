# Sweeper
A set of Mysql cleanup tools for archiving and purging old data

Installation
------------
  $ git clone git@github.com:ardeept/sweeper.git
  $ cd sweeper
  $ npm install
  $ bower install

To Run
------------
  $ grunt serve

To Setup
------------

  /api/manager/initialize
    
  Load the application with the configuration from the file


Features
-------
1. Archive
2. Purge

Process
-------
  1. Query the data using streaming techniques
  2. If archive_table_name is set, this will trigger archiving
      * If the table doesn't exist, it will be created using the table_name structure
  3. Delete the result afterwards


Schedule
-------------
1. Hourly - Jobs that has hourly frequency will be ran
2. Daily - Jobs that has daily frequency will be ran at 0 hour (12AM)


Sample Configuration
-------
    // where all the writing, deletion will take place
    mysql : {
    	host	: "localhost",
    	user 	: "root",
    	password 	: "root",
      database  : "promotexter_test"
    },
    // if this is filled-up
    mysql_slave : {
      host  : "localhost",
      user  : "root",
      password  : "root",
      database  : "promotexter_test"
    },
  
    // seed data
    jobs : [
    	{
    		id 				     : 'clean_sms_q',
    		table_name 		 : 'sms_q',
    		query_string 	: 'datediff(now(), date_created) > 100',
    		description 	: 'Clear old transactions',
        frequency     : 'hourly',
        primary_key   : 'sms_q_id',
        archive_table_name : 'sms_q_archived' -- optional (this will trigger archiving if set)
    	} ,
    ]


