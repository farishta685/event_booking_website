var express = require('express');
var router = express.Router();

//For Argon2 password hashing
const argon2 = require('argon2');

//for sanitizing
const sanitize = require('sanitize-html');

//For Google login
const CLIENT_ID = '477900528659-0il1ijc8cop1muka5pueojbc7u3uej2p.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/get_users', function(req,res, next) { //grab the list of all users for display on the management page and for use in the event creation process
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    let query = "SELECT userID, first_name, last_name, username, email, prefInvite, prefDelete, prefRespond, prefConfirm FROM Users;";
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

router.get('/get_current_user', function(req,res, next) { //grabs all the details of the user currently logged in for various uses
  var userID = req.session.userID;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    let query = "SELECT * FROM Users WHERE userID = ?;";
    connection.query(query,[userID], function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

//Check login details
router.post('/checkEmail', function(req,res){
  var email = sanitize(req.body.email);

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Users.password FROM Users WHERE email = ?;";
    connection.query(query,[email], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/checkGoogleUser', function(req,res){ //gets userID using their token to check if it matches
  var token = req.body.googleToken;

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT userID FROM Users WHERE googleToken = ?;";
    connection.query(query,[token], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


//Check password
router.post('/checkPassword', function(req,res){ //gets user id using the hash of their provided password
  var hashPassword = req.body.hashPassword;
  var password = req.body.passwordInput;
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Users.userID FROM Users WHERE password = ?;";
    connection.query(query,[hashPassword], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }

      try {
        if (await argon2.verify(hashPassword, password)) {
          // password match
          delete hashPassword; ///ADDEDED
          res.json(rows);
        } else {
          // password did not match
          res.sendStatus(401);
        }
      } catch (err) {
        // internal failure
        res.sendStatus(401);
      }
    });
  });
});

//Register user
router.post('/registerUser', function(req,res){
  var firstName = sanitize(req.body.firstName);
  var lastName = sanitize(req.body.lastName);
  var email = sanitize(req.body.email);
  var confirmEmail = sanitize(req.body.confirmEmail);
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var username = sanitize(req.body.username);
  var token = req.body.googleToken;

  req.pool.getConnection( async function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    if(email === confirmEmail && password === confirmPassword){
      //Details match!

      //Argon password hashing
      let hash = null;
      try {
        hash = await argon2.hash(password);
      } catch (err) {
        //If error
        //console.log(err)
        res.sendStatus(500);
        return;
      }

      var query = "INSERT INTO Users (first_name,last_name,username,password,email, googleToken) VALUES (?,?,?,?,?,?);"; //insert into user table
      connection.query(query,[firstName,lastName,username,hash,email,token], function(err, rows, fields){
        if (err){
          //console.log(err)
          res.sendStatus(500);
          return;
        }
      });
      var query = "SELECT Users.userID FROM Users WHERE userID = LAST_INSERT_ID();"; //grab the userID we just inserted
      connection.query(query, function(err, rows, fields){
        connection.release();
        if (err){
          //console.log(err)
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      });
    }
    else { //if details do not match, send error
      res.sendStatus(505);
    }
  });
});

//Check Existing email
router.post('/checkExistingEmail', function(req,res){ // Gets list of all emails

  var checkEmail = sanitize(req.body.email);

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Users WHERE email = ?;";
    connection.query(query,[checkEmail], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


//Check Existing Username
router.post('/checkExistingUsername', function(req,res){ //Gets list of all usernames

  var checkUsername = sanitize(req.body.username);

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Users WHERE username = ?;";
    connection.query(query,[checkUsername], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});



//Cookie and session variable for users when login and register
router.post('/cookie', function(req, res) {
      var userID = req.body.userID;
      req.session.userID = userID;
      req.session.guestID = null; //removes the guest user variable incase the user has one
      res.send()
  });

  router.get('/get_session_userID', function(req,res, next) { //grab the userID out of the current session
    var object = req.session.userID;
    res.send(String(object))
  });




router.post('/validateEmail', function(req, res) {
  var checkEmail = sanitize(req.body.email);
  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = `SELECT * FROM Users WHERE email = ?;`; //this checks the email
    connection.query(query, [checkEmail], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(501);
        return;
      }
      res.json(rows);
    });
  });
});



//Update email
router.post('/updateEmail', function(req, res) {

  var newEmail = sanitize(req.body.email);
  var user_ID = req.session.userID;

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = `UPDATE Users SET email = ? WHERE userID = ?;`; //this updates the email
    connection.query(query,[newEmail, user_ID], function(err, rows, fields){
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

//Get userID
router.get('/get_session_userID', function(req,res, next) { //grab the userID out of the current session
var object = req.session.userID;
res.send(String(object))
});

//Check username in database
router.post('/checkUsernameInDatabase', function(req,res){

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    var newUsername = req.body.newUsername;

    var query = "SELECT userID FROM Users WHERE username = ?;";
    connection.query(query,[newUsername], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }

      res.json(rows);

    });
  });
});

//Change username in database
router.post('/changeUsername', function(req,res){

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    var userID = req.session.userID;
    var newUsername = req.body.newUsername;

    var query = "UPDATE Users SET username = ? WHERE userID = ?;";
    connection.query(query,[newUsername,userID], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }

      res.json(rows);

    });
  });
});


//Get hashed password for update
router.post('/getHashedPasswordForUpdate', function(req,res){

  req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    var userID = req.session.userID;

    var query = "SELECT Users.password FROM Users WHERE userID = ?;"; //gets password hash using user ID for specific user
    connection.query(query,[userID], async function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }

      res.json(rows);

    });
  });
});



//Change password
router.post('/changePassword', function(req, res,next) {

  var newPassword = req.body.newPassword;
  var user_ID = req.session.userID;

  req.pool.getConnection(async function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
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

    var query = `UPDATE Users SET password = ? WHERE userID = ?;`; //this updates the email
    connection.query(query,[hash, user_ID], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(501);
      }
      res.sendStatus(200);
    });
  });
});


//Logout user - normal logout
router.post('/logout', function(req, res,next) {
  if('userID' in req.session){
    delete req.session.userID;
  }
  res.end();
});


//Google validate token
router.post('/tokensignin', async function(req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: '477900528659-0il1ijc8cop1muka5pueojbc7u3uej2p.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const email = payload['email'];



    // Do login stuff here

    // e.g. var query = 'SELECT * FROM user WHERE email = ?';
    res.send(String(userid));
  } catch(err) {
      res.sendStatus(401);
  }
});

router.post('/update_email_pref', function(req, res) {
  var userID = req.session.userID;
  var invite = req.body.invite;
  var deletePref = req.body.delete;
  var confirm = req.body.confirm;
  var respond = req.body.respond;
    req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    var query = `UPDATE Users
    SET prefInvite = ?, prefDelete = ?, prefRespond = ?, prefConfirm = ?
    WHERE userID=?;`; // updates the email preferences
    connection.query(query,[invite, deletePref, respond,confirm, userID], function(err, rows, fields){
      connection.release();
      if (err){
        //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/addToInbox', function(req, res) {
  var userID = req.body.userID; //cant use session since this needs to happen to all guests, not just the logged in one
  var title = req.body.subject;
  var content = req.body.text;
    req.pool.getConnection(function(err,connection){
    if (err){
      //console.log(err)
      res.sendStatus(500);
      return;
    }

    var query = `INSERT INTO Notifications (notifTitle,notifContent,userID)
    VALUES(?,?,?);`; //inserts new notification in the notifications table
    connection.query(query,[title, content, userID], function(err, rows, fields){
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

router.get('/get_current_user', function(req,res, next) { //grabs all the details of the user currently logged in for various uses
  var userID = req.session.userID;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    let query = "SELECT * FROM Users WHERE userID = ?;";
    connection.query(query,[userID], function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/get_notifications', function(req,res, next) { //grabs all the notifications of the user currently logged in for various uses
  var userID = req.session.userID;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      //console.log(err)
      res.sendStatus(500);
      return;
    }
    let query = "SELECT * FROM Notifications WHERE userID = ? ORDER BY notifID;";
    connection.query(query,[userID], function(err,rows,fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

module.exports = router;


