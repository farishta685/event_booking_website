//routes related to event functions
var express = require('express');
var router = express.Router();
const sanitize = require('sanitize-html');
//START EVENT CREATION ROUTES

router.post('/confirm_event', function(req,res){ //create an event
    var name = sanitize(req.body.name);
    var type = req.body.type;
    var location = sanitize(req.body.location);
    var desc = sanitize(req.body.desc);
    var host = req.session.userID;
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = `
      SET @UUID = UUID();`; //set a user variable to generate a UUID but still have access to it
      connection.query(query, function(err, rows, fields){
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        var query = `
        INSERT INTO Events (eventID,eventName, eventDesc,hostID,eventLocation,eventType)
        VALUES (@UUID,?,?,?,?,?);`; //use the user variable and body attributes to create the event
        connection.query(query,[name,desc,host,location,type], function(err, rows, fields){
          if (err){
            ////console.log(err)
            res.sendStatus(500);
            return;
          }
          var query = `
          SELECT eventID FROM Events WHERE eventID=@UUID`; //return the eventID so it can be returned and passed to the next function needed for event creation
          connection.query(query, function(err, rows, fields){
            connection.release(); //finally release the sql connection
            if (err){
              ////console.log(err)
              res.sendStatus(500);
              return;
            }
            res.json(rows); //so, this will send back the eventID of the event that was just created.
          });
        });
      });
    });
  });

  router.post('/create_poll', function(req,res){ //create the event poll
    var id = req.body.id;
    var time1start = req.body.pollStartTime1;
    var time1end = req.body.pollEndTime1;
    var time2start = req.body.pollStartTime2;
    var time2end = req.body.pollEndTime2;
    var time3start = req.body.pollStartTime3;
    var time3end = req.body.pollEndTime3;
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = `INSERT INTO Poll (pollStartTime1, pollEndTime1, pollStartTime2, pollEndTime2, pollStartTime3, pollEndTime3, eventID)
      VALUES(?,?,?,?,?,?,?);`; //create the poll
      connection.query(query,[time1start,time1end,time2start,time2end,time3start,time3end,id], function(err, rows, fields){
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        var query = `
        UPDATE Events SET eventPoll = LAST_INSERT_ID() WHERE eventID = ?;`; //update the event listing to include the poll id of the poll just created
        connection.query(query,[id], function(err, rows, fields){
          connection.release();
          if (err){
            ////console.log(err)
            res.sendStatus(500);
            return;
          }
        res.sendStatus(200); //send a success status if all went well
      });
      });
    });
  });

  router.post('/create_guests', function(req,res){ //creates the invitee list in the database
    var id = req.body.id;
    var guest = req.body.guest; //This has the userID of the current guest to add
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = `INSERT INTO Invitees (userID,eventID)
      VALUES (?, ?);`;
      connection.query(query,[guest,id], function(err, rows, fields){
        connection.release();
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200); //send success if nothing went wrong
      });
    });
  });
//END EVENT CREATION ROUTES

//START EVENT PAGE ROUTES
router.post('/get_event_details', function(req,res){ //get event details from sql to display on event page
    var id = req.body.eventID; //grab sent eventID from body
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = "SELECT eventName, eventDesc, eventStatus,eventLocation,eventType, eventStartTime, eventEndTime FROM Events WHERE eventID = ?;";
      connection.query(query,[id], function(err, rows, fields){
        connection.release();
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        res.json(rows); //send details
      });
    });
  });

  //GETS USERS EVENTS
router.get('/get_user_event_details', function(req,res){ //get event details from sql to display on event page
  var userid = req.session.userID; //grab sent eventID from session
  req.pool.getConnection(function(err,connection){
    if (err){
      ////console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Events.eventName, Events.eventStatus, Events.eventID, Events.eventStartTime FROM Events INNER JOIN Invitees ON Events.eventID=Invitees.eventID WHERE Invitees.userID = ? ORDER BY Events.eventStartTime;";
    connection.query(query,[userid,userid], function(err, rows, fields){
      connection.release();
      if (err){
       // //console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send details
    });
  });
});

  router.post('/get_poll_details', function(req,res){ //get poll details from sql to display on event page
    var id = req.body.eventID; //grab eventID from body
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = "SELECT pollStartTime1, pollEndTime1, pollStartTime2, pollEndTime2, pollStartTime3, pollEndTime3 FROM Poll WHERE eventID = ?;";
      connection.query(query,[id], function(err, rows, fields){
        connection.release();
        if (err){
         // //console.log(err)
          res.sendStatus(500);
          return;
        }
        res.json(rows); //send details
      });
    });
  });

  router.post('/get_guest_details', function(req,res){
    var id = req.body.eventID; //grab eventID from body
    req.pool.getConnection(function(err,connection){
      if (err){
        ////console.log(err)
        res.sendStatus(500);
        return;
      }
      var query = `SELECT
      CASE WHEN Invitees.userID IS NULL THEN 'NULL'
      ELSE Users.userID
      END as userID,
      CASE WHEN Invitees.userID IS NULL THEN Invitees.invitees_first_name
      ELSE Users.first_name
      END as invitees_first_name,
      CASE WHEN Invitees.userID IS NULL THEN Invitees.invitees_last_name
      ELSE Users.last_name
      END as invitees_last_name,
      CASE WHEN Invitees.userID IS NULL THEN Invitees.invitees_username
      ELSE Users.username
      END as invitees_username,
      CASE WHEN Invitees.userID IS NULL THEN Invitees.invitees_email
      ELSE Users.email
      END as invitees_email,
      CASE WHEN Invitees.userID IS NULL THEN 'NULL'
      ELSE Users.prefInvite
      END as invitees_prefInvite,
      CASE WHEN Invitees.userID IS NULL THEN 'NULL'
      ELSE Users.prefDelete
      END as invitees_prefDelete,
      CASE WHEN Invitees.userID IS NULL THEN 'NULL'
      ELSE Users.prefRespond
      END as invitees_prefRespond,
      CASE WHEN Invitees.userID IS NULL THEN 'NULL'
      ELSE Users.prefConfirm
      END as invitees_prefConfirm,
      Invitees.invitees_status,
      Invitees.vote_choice1,
      Invitees.vote_choice2,
      Invitees.vote_choice3
      FROM Invitees
      LEFT JOIN Users ON Invitees.userID=Users.userID
      WHERE eventID = ?;`; //woah, its a sql case statement. It grabs either the details manually entered by someone without an account or it uses the user id to grab the details of a registered user
      connection.query(query,[id], function(err, rows, fields){
        connection.release();
        if (err){
         // //console.log(err)
          res.sendStatus(500);
          return;
        }
        res.json(rows); //send details
      });
    });
  });

    router.post('/delete_event', function(req,res){ //deletes the event, this route is called from the event page and management page so either the host or admins can delete the event
    var id = req.body.eventID;
    //console.log(id);
    req.pool.getConnection(function(err,connection){
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        var query = `DELETE FROM Events WHERE eventID = ?;`; //this deletes the event which will also delete its associated poll and invite list automatically
        connection.query(query,[id], function(err, rows, fields){
        connection.release();
        if (err){
          ////console.log(err)
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
        });
    });
    });

    router.post('/get_host_details', function(req,res){ //get poll details from sql to display on event page
      var id = req.body.eventID; //grab eventID from body
      req.pool.getConnection(function(err,connection){
        if (err){
         // //console.log(err)
          res.sendStatus(500);
          return;
        }
        var query = "SELECT Users.username, Users.first_name, Users.last_name, Users.email, Users.userID FROM Users INNER JOIN Events ON Events.hostID=Users.userID WHERE Events.eventID = ?;";
        connection.query(query,[id], function(err, rows, fields){
          connection.release();
          if (err){
            ////console.log(err)
            res.sendStatus(500);
            return;
          }
          res.json(rows); //send details
        });
      });
    });

    router.post('/checkHost', function(req,res){ //Check if the user is the host
      var id = req.body.eventID;
      req.pool.getConnection(function(err,connection){
          if (err){
            ////console.log(err)
            res.sendStatus(500);
            return;
          }
          var query = `SELECT hostID FROM Events WHERE eventID = ?;`; //this deletes the event which will also delete its associated poll and invite list automatically
          connection.query(query,[id], function(err, rows, fields){
          connection.release();
          if (err){
            ////console.log(err)
            res.sendStatus(500);
            return;
          }
          if (req.session.userID === rows[0].hostID){
            res.sendStatus(200);
          }
          else{
            res.sendStatus(403);
          }
          });
      });
      });

      router.post('/finalise', function(req,res){ //Inserts the final time of the event into the database and updates the event status to confirmed
        var id = req.body.eventID;
        var starttime = req.body.starttime;
        var endtime = req.body.endtime;
        req.pool.getConnection(function(err,connection){
            if (err){
              ////console.log(err)
              res.sendStatus(500);
              return;
            }
            var query = `UPDATE Events
            SET eventStatus='Confirmed', eventStartTime=?, eventEndTime=?
            WHERE eventID=?;`; //this deletes the event which will also delete its associated poll and invite list automatically
            connection.query(query,[starttime,endtime,id], function(err, rows, fields){
            connection.release();
            if (err){
              ////console.log(err)
              res.sendStatus(500);
              return;
            }
            res.sendStatus(200);
            });
        });
        });

        router.post('/checkIfNewGuest', function(req,res){ //Inserts the final time of the event into the database and updates the event status to confirmed
          var id = req.body.eventID;
          var firstname = req.body.first_name;
          var lastname = req.body.last_name;
          var email = req.body.email;
          req.pool.getConnection(function(err,connection){
              if (err){
                ////console.log(err)
                res.sendStatus(500);
                return;
              }
              var query = `SELECT * FROM Invitees WHERE eventID = ? AND invitees_first_name = ? AND invitees_last_name = ? AND invitees_email = ?;`; //will return the guests row if it exists already
              connection.query(query,[id,firstname,lastname,email], function(err, rows, fields){
              connection.release();
              if (err){
                ////console.log(err)
                res.sendStatus(500);
                return;
              }
              res.json(rows);
              });
          });
          });

          router.post('/registerGuest', function(req,res){ //Inserts the guest into the invitees table
            var id = req.body.eventID;
            var firstname = sanitize(req.body.first_name);
            var lastname = sanitize(req.body.last_name);
            var email = sanitize(req.body.email);
            req.pool.getConnection(function(err,connection){
                if (err){
                 // //console.log(err)
                  res.sendStatus(500);
                  return;
                }
                var query = `INSERT INTO Invitees (invitees_first_name, invitees_last_name, invitees_email, eventID)
                VALUES (?,?,?,?);`;
                connection.query(query,[firstname,lastname,email,id], function(err, rows, fields){
                if (err){
                 // //console.log(err)
                  res.sendStatus(500);
                  return;
                }
                var query = `SELECT LAST_INSERT_ID() as id;`; //grab the ID of the guest just inserted
                connection.query(query,[firstname,lastname,email,id], function(err, rows, fields){
                connection.release();
                if (err){
                 // //console.log(err)
                  res.sendStatus(500);
                  return;
                }
                res.json(rows[0]);
                });
                });
            });
            });

            router.post('/loginGuest', function(req,res){ //gives the guest their identifying session variable
              req.session.guestID = req.body.guestID;
              res.send();
            });

            router.post('/respondToInvite', function(req,res){ //Changes the status of the invitee to going or rejected depending on the button
              var id = req.body.eventID;
              var newStatus = req.body.newStatus;
              var userID = req.session.userID;
              var inviteesID = req.session.guestID;
              req.pool.getConnection(function(err,connection){
                  if (err){
                    ////console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  var query = `UPDATE Invitees
                  SET invitees_status = ?
                  WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //will return the guests row if it exists already
                  connection.query(query,[newStatus,id, inviteesID,userID], function(err, rows, fields){
                  connection.release();
                  if (err){
                    ////console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  res.json(rows);
                  });
              });
            });

            router.post('/checkIfResponded', function(req,res){ //Checks if the current user has already responded to the event to prevent them from responding again
              var id = req.body.eventID;
              var inviteesID = req.session.guestID;
              var userID = req.session.userID;
              req.pool.getConnection(function(err,connection){
                  if (err){
                    ////console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  var query = `SELECT invitees_status FROM Invitees
                  WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //will return the status
                  connection.query(query,[id, inviteesID,userID], function(err, rows, fields){
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

            router.post('/vote', function(req,res){ //Saves the users vote
              var id = req.body.eventID;
              var inviteesID = req.session.guestID;
              var userID = req.session.userID;
              var choice = req.body.choice;
              var query;
              if (choice == "voted1"){
                query = `UPDATE Invitees SET vote_choice1 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              else if (choice == "voted2"){
                query = `UPDATE Invitees SET vote_choice2 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              else if (choice == "voted3"){
                query = `UPDATE Invitees SET vote_choice3 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              req.pool.getConnection(function(err,connection){
                  if (err){
                    //console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  connection.query(query,[id, inviteesID,userID], function(err, rows, fields){
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

            router.post('/unvote', function(req,res){ //Saves the users vote
              var id = req.body.eventID;
              var inviteesID = req.session.guestID;
              var userID = req.session.userID;
              var choice = req.body.choice;
              var query;
              if (choice == "voted1"){
                query = `UPDATE Invitees SET vote_choice1 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              else if (choice == "voted2"){
                query = `UPDATE Invitees SET vote_choice2 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              else if (choice == "voted3"){
                query = `UPDATE Invitees SET vote_choice3 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //prepares the query to save the vote
              }
              req.pool.getConnection(function(err,connection){
                  if (err){
                    //console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  connection.query(query,[id, inviteesID,userID], function(err, rows, fields){
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

            router.post('/checkVoteStatus', function(req,res){ //Checks if the current user has already responded to the event to prevent them from responding again
              var id = req.body.eventID;
              var inviteesID = req.session.guestID;
              var userID = req.session.userID;
              req.pool.getConnection(function(err,connection){
                  if (err){
                    //console.log(err)
                    res.sendStatus(500);
                    return;
                  }
                  var query = `SELECT vote_choice1, vote_choice2, vote_choice3 FROM Invitees
                  WHERE eventID = ? AND (inviteesID = ? OR userID = ?);`; //will return the status
                  connection.query(query,[id, inviteesID,userID], function(err, rows, fields){
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

//END EVENT PAGE ROUTES

module.exports = router;