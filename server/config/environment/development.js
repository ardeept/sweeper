'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/mysqljanitor-dev'
  },

  seedDB: true,

  platform : "PT2-SMPP",
  mysql : {
    	host	: "37.139.1asdad1.175",
    	user 	: "ptxter_api",
    	password 	: "ptxterv2_api",
      database  : "promotexter"
  },

  mysql_slave : {
      host      : "37.139.4.87",
      user      : "ptxter_api",
      password  : "ptxterv2_api",
      database  : "promotexter"
  },

  live_delete : false,

  jobs : [
  	{
  		id 				   : 'clean_sms_q',
  		table_name 		: 'sms_q',
  		query_string 	: 'datediff(now(), date_created) > 720',
  		description 	: 'Clear old transactions in sms_q',
      frequency     : 'hourly',
      primary_key   : 'sms_q_id'
  	}
  ]
};
