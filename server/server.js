const express = require('express'); //load the express library into the file
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');

const db = mysql.createConnection(mysqlcredentials);

const server = express();

server.use(express.static( __dirname + '/html' ));

server.get('/api/grades', (req, res)=>{
    res.send(`{
      "success": true,
      "data": [{
        "id": 10,
        "name": "Jaime",
        "course": "Algebra",
        "grade": 100
      }, {
        "id": 12,
        "name": "Holmes",
        "course": "Investigation",
        "grade": 90
      }, {
        "id": 14,
        "name": "Watson",
        "course": "Writing",
        "grade": 80
      }]
    }`)
});

server.listen(3001,()=>{
    // console.log('server is running on port 3001');
    console.log('carrier has arrived');
});