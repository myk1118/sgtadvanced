const express = require('express'); //load the express library into the file
const mysql = require('mysql'); //load the mysql library
const mysqlcredentials = require('./mysqlcreds.js'); //load the credentials from a local file for mysql

//using the credentials that we loaded, establish a preliminary connection to the database
const db = mysql.createConnection(mysqlcredentials);

const server = express();

//middleware
server.use(express.static( __dirname + '/html' ));
server.use(express.urlencoded( {extended: false} )); //have express pull body data that is urlencoded and place it into an object called "body"

//make an endpoint to handle retrieving the grades of all students
server.get('/api/grades', (req, res) => { //when this server receives request at this port ('/api/grades') call this function
    //establish the connection to the database, and call the callback function when connection is made
    db.connect(() => {
        //create a query for our desired operation
        const query = 'SELECT `id`, CONCAT(`givenname`,\" \",`surname`) AS `name`, `course`, `grade` FROM `grades`';
        //send the query to the database, and call the given callback function once the data is retrieved or an error happens
        db.query(query, (error, data) => {
            //if error is null, no error occurred.
            //create an output object to be sent back to the client
            const output = {
                success: false,
            };
            //if error is null, send the data
            if(!error) {
                //notify the client that we were successful
                output.success = true;
                //attach the data from the database to the output object
                output.data = data;
            } else {
                //an error occurred, attach that error onto the output so we can see what happened
               output.error = error;
            }
            //send the data back to the client
            res.send(output);
        })
    })
});

server.post('/api/grades', (request, response) => {

});

server.listen(3001,()=>{
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
});