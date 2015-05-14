# mysql-janitor
A set of Mysql cleanup tools for archiving and purging

Features
-------
1. Archiving old data
2. Purging old data

Process
-------
  1. Query the data using streaming techniques
  2. For archive option, for every result, insert the result to 'to_table'
  3. Delete the result afterwards

Configuration
-------
    mysql : {
      host   : 'localhost',  
      user   : 'user',
      pass   : 'user'
    }

    job_execution : {
      frequency       : 'daily'
      execution_time  : '00:00' 
    }


#Features

## Add Janitor

POST REQUEST to /api/janitors/

      Parameters (JSON):
      
      id                  - unique identifier of the janitor object
      table_name          - the mysql table name of the target 
      table_to_name       - the mysql table where to put the data before purging(optional)
      condition           - the query string (valid mysql string)
      description         - Thorough description of the job

        Example:
        {
            id                  : 'clean_sms_q',
            table_name          : 'sms_q',
            table_to_name       : 'sms_q_archived',
            condition           : 'date_diff(now(), date_created) > 60' -- greater than 60 days,
            description         : 'Cleanup transactions older than 60 days'
        }

##Remove Janitor
DELETE REQUEST to /api/janitors/

    Parameter: janitor_id
    
User Interface
-----
    1. View all janitors
      - number of execution
      - number of transactions processed
    2. Delete janitor
    3. Add janitor
    4. Login / Logout
