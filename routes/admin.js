//routes related to admin functions
var express = require('express');
var router = express.Router();

//For Argon2 password hashing
const argon2 = require('argon2');

router.post('/delete_event', function(req,res){ //deletes the event, this route is called from the event page and management page so either the host or admins can delete the event
  var id = req.body.eventID;
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = `DELETE FROM Events WHERE Events.eventID=?;`; //this deletes the event and the associated poll tied to it
    connection.query(query,[id], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.post('/delete_admin', function(req,res){ //deletes a system admin
  var id = req.body.userID;
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = `DELETE FROM Systems_Admins WHERE Systems_Admins.userID=?;`; //this deletes the user as an admin
    connection.query(query,[id], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.post('/delete_user', function(req,res){ //finally deletes a user
  var id = req.body.userID;
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = `DELETE FROM Users WHERE Users.userID=?;`; // deletes regular user
    connection.query(query,[id], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.post('/promote_admin', function(req,res){ //deletes a system admin
  var id = req.body.userID;
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    let query = `INSERT INTO Systems_Admins VALUES (?);`; //this adds the user as an admin
    connection.query(query,[id], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.get('/get_managers', function(req,res, next) { //grab the list of all admins for display on the management page
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Users.userID, Users.username, Users.first_name, Users.last_name FROM Users INNER JOIN Systems_Admins ON Systems_Admins.userID=Users.userID WHERE Users.userID = Systems_Admins.userID;";
    connection.query(query, function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/get_users', function(req,res, next) { //grab the list of all admins for display on the management page
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT userID, username, email, first_name, last_name FROM Users;";
    connection.query(query, function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/get_events', function(req,res, next) { //grab the list of events for display on the management page
  req.pool.getConnection(function(err,connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let query = "SELECT Events.eventID, Events.hostID, Users.first_name, Users.last_name, Events.eventName, Events.eventDesc FROM Events INNER JOIN Users ON Events.hostID = Users.userID;";
    connection.query(query, function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.post('/checkIfManager', function(req,res) { //grab the list of all admins for display on the management page
  var user_ID = req.session.userID;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Systems_Admins WHERE userID = ?;";
    connection.query(query, [user_ID], function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

//Admin update username
router.post('/adminUpdateUsername', function(req,res) { //grab the list of all admins for display on the management page
  var userID = req.body.userID;
  var newUsername = req.body.newUsername;

  console.log("UserID to change = " +userID);

  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Users SET username = ? WHERE userID = ?;";
    connection.query(query, [newUsername,userID], function(err,rows,fields) {
      console.log("After query");
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200); // send response
    });
  });
});


//Admin update password
router.post('/adminUpdatePassword', function(req,res) { //grab the list of all admins for display on the management page
  var userID = req.body.userID;
  var newPassword = req.body.newPassword;

  console.log("UserID to change = " +userID);

  req.pool.getConnection(async function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    //Argon password hashing
    let hash = null;
    try {
      hash = await argon2.hash(newPassword);
    } catch (err) {
      //If error
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Users SET password = ? WHERE userID = ?;";
    connection.query(query, [hash,userID], function(err,rows,fields) {
      console.log("After query");
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200); // send response
    });
  });
});

  module.exports = router;