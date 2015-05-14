# Sweeper
A set of Mysql cleanup tools for archiving and purging old data

Features
-------
1. Archive
2. Purge

Process
-------
  1. Query the data using streaming techniques
  2. For archive option, for every result, insert the result to 'to_table'
  3. Delete the result afterwards

Configuration
-------
    mysql : {
    	host	: "localhost",
    	user 	: "root",
    	password 	: "root",
      database  : "promotexter_test"
    },
  
    jobs : [
    	{
    		id 				   : 'clean_sms_q',
    		table_name 		: 'sms_q',
    		query_string 	: 'datediff(now(), date_created) > 100',
    		description 	: 'Clear old transactions',
        frequency     : 'hourly',
        primary_key   : 'sms_q_id'
    	} ,
    ]


#API
/initialize
    
  Load the application with the configuration from the file

/run/:id

  Run the sweeping using the job ID

