-- this page contains the list of all queries used in our route for fetching sql data

-- LIST OF QUERIES USED IN admin.js

-- '/delete_event'
-- var id = req.body.eventID;
--    deletes the event and the associated poll tied to it
DELETE FROM Events WHERE Events.eventID=?;


-- '/delete_admin'
-- var id = req.body.userID;
-- deletes the user as an admin
DELETE FROM Systems_Admins WHERE Systems_Admins.userID=?;


-- '/delete_user'
-- var id = req.body.userID;
-- deletes a regular user. used by admin users
DELETE FROM Users WHERE Users.userID=?;


-- '/promote_admin'
-- var id = req.body.userID;
-- adds the user as an admin
INSERT INTO Systems_Admins VALUES (?);


-- '/get_managers'

-- grabs the list of all admins for display on the management page
SELECT Users.userID, Users.username, Users.first_name, Users.last_name FROM Users INNER JOIN Systems_Admins ON Systems_Admins.userID=Users.userID WHERE Users.userID = Systems_Admins.userID;


-- '/get_events'
-- grabs the list of events for display on the management page
SELECT Events.eventID, Events.hostID, Users.first_name, Users.last_name, Events.eventName, Events.eventDesc FROM Events INNER JOIN Users ON Events.hostID = Users.userID;


-- '/checkIfManager'
-- var user_ID = req.session.userID;
-- grabs the list of all admins for display on the management page
SELECT * FROM Systems_Admins WHERE userID = ?;



--LIST OF QUERIES USED IN event.js
-- '/confirm_event'
-- var name = sanitize(req.body.name);
-- var type = req.body.type;
-- var location = sanitize(req.body.location);
-- var desc = sanitize(req.body.desc);
-- var host = req.session.userID;
--set a user variable to generate a UUID but still have access to it
SET @UUID = UUID();
--use the user variable and body attributes to create the event
INSERT INTO Events (eventID,eventName, eventDesc,hostID,eventLocation,eventType) VALUES (@UUID,?,?,?,?,?);
--return the eventID so it can be returned and passed to the next function needed for event creation
SELECT eventID FROM Events WHERE eventID=@UUID;


-- '/create_poll'
-- var id = req.body.id;
-- var time1start = req.body.pollStartTime1;
-- var time1end = req.body.pollEndTime1;
-- var time2start = req.body.pollStartTime2;
-- var time2end = req.body.pollEndTime2;
-- var time3start = req.body.pollStartTime3;
-- var time3end = req.body.pollEndTime3;
--create a new poll in the database
INSERT INTO Poll (pollStartTime1, pollEndTime1, pollStartTime2, pollEndTime2, pollStartTime3, pollEndTime3, eventID) VALUES(?,?,?,?,?,?,?);
--update the event listing to include the poll id of the poll just created
UPDATE Events SET eventPoll = LAST_INSERT_ID() WHERE eventID = ?;


-- '/create_guests'
-- var id = req.body.id;
-- var guest = req.body.guest;
-- creates the invitee list in the database
INSERT INTO Invitees (userID,eventID) VALUES (?, ?);


-- '/get_event_details'
--var id = req.body.eventID
--get event details from sql to display on event page
SELECT eventName, eventDesc, eventStatus,eventLocation,eventType, eventStartTime, eventEndTime FROM Events WHERE eventID = ?;

-- '/get_user_event_details'
-- var userid = req.body.userID; //grab sent eventID from body
-- get event details belonging to said User from sql to display on users dashboard
SELECT eventName, eventStatus, eventID, eventTime FROM Events INNER JOIN Invitees ON Events.eventID=Invitees.eventID WHERE Invitees.userID = ? ORDER BY Events.eventStartTime;


-- '/get_poll_details'
-- var id = req.body.eventID; //grab eventID from body
-- get poll details from sql to display on event page
SELECT pollStartTime1, pollEndTime1, pollStartTime2, pollEndTime2, pollStartTime3, pollEndTime3 FROM Poll WHERE eventID = ?;


-- '/get_guest_details'
-- var id = req.body.eventID; //grab eventID from body
-- woah, its a sql case statement. It grabs either the details manually entered by someone without an account or it uses the user id to grab the details of a registered user
SELECT
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
      WHERE eventID = ?;


-- '/delete_event'
-- var id = req.body.eventID;
-- this deletes the event which will also delete its associated poll and invite list automatically
DELETE FROM Events WHERE eventID = ?;


-- '/get_host_details'
-- var id = req.body.eventID; //grab eventID from body
-- get poll details from sql to display on event page
SELECT Users.username, Users.first_name, Users.last_name, Users.email, Users.userID FROM Users INNER JOIN Events ON Events.hostID=Users.userID WHERE Events.eventID = ?;


-- '/checkHost'
-- var id = req.body.eventID;
-- this deletes the event which will also delete its associated poll and invite list automatically
SELECT hostID FROM Events WHERE eventID = ?;


-- '/finalise'
-- var id = req.body.eventID;
-- var starttime = req.body.starttime;
-- var endtime = req.body.endtime;
-- this deletes the event which will also delete its associated poll and invite list automatically
UPDATE Events   SET eventStatus='Confirmed', eventStartTime=?, eventEndTime=?   WHERE eventID=?;


-- '/checkIfNewGuest'
-- var id = req.body.eventID;
-- var firstname = req.body.first_name;
-- var lastname = req.body.last_name;
-- var email = req.body.email;
-- Inserts the final time of the event into the database and updates the event status to confirmed
SELECT * FROM Invitees WHERE eventID = ? AND invitees_first_name = ? AND invitees_last_name = ? AND invitees_email = ?;


-- '/registerGuest'
-- var id = req.body.eventID;
-- var firstname = sanitize(req.body.first_name);
-- var lastname = sanitize(req.body.last_name);
-- var email = sanitize(req.body.email);
-- Inserts the guest into the invitees table
INSERT INTO Invitees (invitees_first_name, invitees_last_name, invitees_email, eventID) VALUES (?,?,?,?);
-- grab the ID of the guest just inserted
SELECT LAST_INSERT_ID() as id;


-- '/loginGuest'
-- req.session.guestID = req.body.guestID;
-- just send the guestID in the response


-- '/respondToInvite'
-- var id = req.body.eventID;
-- var newStatus = req.body.newStatus;
-- var userID = req.session.userID;
-- var inviteesID = req.session.guestID;
-- will return the guests row if it exists already
UPDATE Invitees SET invitees_status = ? WHERE eventID = ? AND (inviteesID = ? OR userID = ?);


-- '/checkIfResponded'
-- var id = req.body.eventID;
-- var inviteesID = req.session.guestID;
-- var userID = req.session.userID;
-- will return the status
SELECT invitees_status FROM Invitees WHERE eventID = ? AND (inviteesID = ? OR userID = ?);


-- '/vote'
-- var id = req.body.eventID;
-- var inviteesID = req.session.guestID;
-- var userID = req.session.userID;
-- var choice = req.body.choice;
-- var query;
-- Saves the users vote
-- if (choice == "voted1")
UPDATE Invitees SET vote_choice1 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);
-- else if (choice == "voted2")
UPDATE Invitees SET vote_choice2 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);
-- else if (choice == "voted3")
UPDATE Invitees SET vote_choice3 = 1 WHERE eventID = ? AND (inviteesID = ? OR userID = ?);



-- '/unvote'
-- var id = req.body.eventID;
-- var inviteesID = req.session.guestID;
-- var userID = req.session.userID;
-- var choice = req.body.choice;
-- var query;
-- updates the users vote if they choose to unvote a time
-- else if (choice == "voted1")
UPDATE Invitees SET vote_choice1 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);
-- else if (choice == "voted2")
UPDATE Invitees SET vote_choice2 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);
-- else if (choice == "voted3")
UPDATE Invitees SET vote_choice3 = NULL WHERE eventID = ? AND (inviteesID = ? OR userID = ?);



-- '/checkVoteStatus'
-- var id = req.body.eventID;
-- var inviteesID = req.session.guestID;
-- var userID = req.session.userID;
-- will return the status of the vote/poll time
SELECT vote_choice1, vote_choice2, vote_choice3 FROM Invitees WHERE eventID = ? AND (inviteesID = ? OR userID = ?);



-- LIST OF QUERIES USED IN  users.js

-- '/get_users'
-- grab the list of all users for display on the management page and for use in the event creation process
SELECT userID, first_name, last_name, username, email, prefInvite, prefDelete, prefRespond, prefConfirm FROM Users;


-- '/get_current_user'
-- var userID = req.session.userID;
-- grabs all the details of the user currently logged in for various uses
SELECT * FROM Users WHERE userID = ?;


-- '/checkEmail'
-- var email = sanitize(req.body.email);
-- TO Check login details so need password hash
SELECT Users.password FROM Users WHERE email = ?;


-- '/checkGoogleUser'
-- var token = req.body.googleToken;
-- gets userID using their token to check if it matches
SELECT userID FROM Users WHERE googleToken = ?;


-- '/checkPassword'
-- var hashPassword = req.body.hashPassword;
-- var password = req.body.passwordInput;
-- gets user id using the hash of their provided password
SELECT Users.userID FROM Users WHERE password = ?;


-- '/registerUser'
-- var firstName = sanitize(req.body.firstName);
-- var lastName = sanitize(req.body.lastName);
-- var email = sanitize(req.body.email);
-- var confirmEmail = sanitize(req.body.confirmEmail);
-- var password = req.body.password;
-- var confirmPassword = req.body.confirmPassword;
-- var username = sanitize(req.body.username);
-- var token = req.body.googleToken;
-- insert into user table
INSERT INTO Users (first_name,last_name,username,password,email, googleToken) VALUES (?,?,?,?,?,?);
-- grab the userID we just inserted
SELECT Users.userID FROM Users WHERE userID = LAST_INSERT_ID();


-- '/checkExistingEmail'
-- var checkEmail = sanitize(req.body.email);
-- Gets list of all emails to check if userexits
SELECT * FROM Users WHERE email = ?;


-- '/checkExistingUsername'
-- var checkUsername = sanitize(req.body.username);
-- Gets list of all usernames
SELECT * FROM Users WHERE username = ?;



-- '/validateEmail'
-- var checkEmail = sanitize(req.body.email);
-- this checks the email
SELECT * FROM Users WHERE email = ?;


-- '/updateEmail'
-- var newEmail = sanitize(req.body.email);
-- var user_ID = req.session.userID;
-- this updates the email
UPDATE Users SET email = ? WHERE userID = ?;


-- '/get_session_userID'
-- var object = req.session.userID;
-- res.send(String(object))


-- '/getHashedPasswordForUpdate'
-- var userID = req.session.userID;
-- gets password hash using user ID for specific user
SELECT Users.password FROM Users WHERE userID = ?;


-- '/changePassword'
--  var newPassword = req.body.newPassword;
-- var user_ID = req.session.userID;
-- this updates the email
UPDATE Users SET password = ? WHERE userID = ?;


-- '/update_email_pref'
-- var userID = req.session.userID;
-- var invite = req.body.invite;
-- var deletePref = req.body.delete;
-- var confirm = req.body.confirm;
-- var respond = req.body.respond;
-- updates the email preferences with the updated values above
UPDATE Users SET prefInvite = ?, prefDelete = ?, prefRespond = ?, prefConfirm = ? WHERE userID=?;


-- '/addToInbox'
-- var userID = req.body.userID; //cant use session since this needs to happen to all guests, not just the logged in one
-- var title = req.body.subject;
-- var content = req.body.text;
-- inserts new notification in the notifications table
INSERT INTO Notifications (notifTitle,notifContent,userID) VALUES(?,?,?);


-- '/get_current_user'
-- var userID = req.session.userID;
-- grabs all the details of the user currently logged in for various uses
SELECT * FROM Users WHERE userID = ?;


-- '/get_notifications'
-- var userID = req.session.userID;
-- grabs all the notifications of the user currently logged in for various uses
SELECT * FROM Notifications WHERE userID = ? ORDER BY notifID;

