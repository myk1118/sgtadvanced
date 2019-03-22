const express = require('express'); //load the express library into the file
const mysql = require('mysql'); //load the mysql library
const mysqlcredentials = require('./mysqlcreds.js'); //load the credentials from a local file for mysql

//using the credentials that we loaded, establish a preliminary connection to the database
const db = mysql.createConnection(mysqlcredentials);

const server = express();

//middleware
server.use(express.static( __dirname + '/html' ));
server.use(express.urlencoded( {extended: false} )); //have express pull body data that is urlencoded and place it into an object called "body"
// server.use(express.json()); //used for things like axios

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

// INSERT INTO `grades` SET `surname`="Stark", `givenname`="Tony", `course`="Business", `grade`=100, `added`=NOW();
// INSERT INTO `grades` (`surname`, `givenname`, `course`, `grade`) VALUES ("Stark", "Tony", "Business", 100), ("Holmes", "Sherlock", "Investigation", 90);

server.post('/api/grades', (request, response) => {
    //check the body object and see if any data was not sent
    if(request.body.name === undefined || request.body.course === undefined || request.body.grade === undefined) {
        //respond to the client with an appropriate error message
        response.send({
            success: false,
            error: 'invalid name, course, or grade'
        });
        return;
    }
    //connect to the database
    db.connect(() => {
        //creating a name - splitting first and last names
        const name = request.body.name.split(" ");

        //creating a string, concatenating all the information
        //"joe dei rossi" -> ['joe', 'dei', 'rossi'] -> ['dei', 'rossi'] -> 'dei rossi'
        const query = 'INSERT INTO `grades` SET `surname`="'+name.slice(1).join(' ')+'", `givenname`="'+name[0]+'", `course`="'+request.body.course+'", `grade`='+request.body.grade+', `added`=NOW()';
        // console.log(query);
        // response.send(query);

        db.query(query, (error, result) => {
            if(!error) {
                // console.log(result.insertId);
                response.send({
                    success: true,
                    new_id: result.insertId
                })
            } else {
                response.send({
                    success: false,
                    error //es6 structuring so you can just say error
                })
            }
        })
    })
});

//request - from client to server
//query = all data in the query string
server.delete('/api/grades', (request, response) => {
    if(request.query.student_id === undefined) {
        response.send({ //send is like return
            success: false,
            error: 'must provide a student id for delete'
        });
        return;
    }
    db.connect(() => {
        const query = "DELETE FROM `grades` WHERE `id`= " + request.query.student_id;
        db.query(query, (error, result) => {
            if(!error) {
                response.send({
                    success: true
                })
            } else {
                response.send({
                    success: false,
                    error
                })
            }
        })
    })
});

server.listen(3001,()=>{
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
});