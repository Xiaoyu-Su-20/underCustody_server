Thanks to this Postgres, Express, React, and Node tutorial https://www.youtube.com/watch?v=ldYcgPKEZC8

# Get the database ready
### To create schemas in postgres database
run the SQL CREATE TABLE statements in ddl.sql
### To load the csv files 
using the csv files in the csv_data folder, run the COPY statements in ddl.sql (have to change directory of the csv files)

# To build the app
### (1) go to the main folder
### (2) install express, pg, and cors
npm install 
### (3) run the server
npm install -g nodemon

nodemon backend.js

### (4) go to the client folder
### (5) run the app
npm install

npm start
