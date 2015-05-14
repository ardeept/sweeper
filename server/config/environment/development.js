'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/mysqljanitor-dev'
  },

  seedDB: true,


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
    {
      id           : 'clean_sms_q2',
      table_name    : 'sms_q1',
      query_string  : 'datediff(now(), date_created) > 100',
      description   : 'Clear old transactions',
      frequency     : 'hourly',
      primary_key   : 'sms_q_id'
    } ,
    {
      id           : 'clean_sms_q3',
      table_name    : 'sms_q2',
      query_string  : 'datediff(now(), date_created) > 100',
      description   : 'Clear old transactions',
      frequency     : 'hourly',
      primary_key   : 'sms_q_id'
    } 
  ]
};
