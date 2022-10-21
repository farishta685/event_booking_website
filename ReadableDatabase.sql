/* Instructions to set up on your local computer
IGNORE THIS IGNORE THIS IGNORE THIS

sql_start                                                 starts sql server
mysql --host=127.0.0.1 < ReadableDatabase.sql              imports the EMPTY database in
mysql --host=127.0.0.1                                    starts the sql thing
SHOW DATABASES;                                           Check that ProjectDatabase now exists on your sql
USE ProjectDatabase                                       Select our database to use, now you can do queries.

TO SAVE THE Database
exit
mysqldump --host=127.0.0.1 --databases ProjectDatabase > ProjectDatabase.sql

IGNORE THIS IGNORE THIS IGNORE THIS (unless I tell you otherwise lol)
*/

/*THIS FILE IS SO I CAN MAKE EASY CHANGES AND KEEP MY COMMENTS SINCE THE BACKUP VERSION SUCKS */

/* ATTENTION ATTENTION ATTENTION ATTENTION ATTENTION ATTENTION ATTENTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Please use the mysql --host=127.0.0.1 < ProjectDatabase.sql command to load in the database with data inside it

First section is the database creation, second section is all the queries
*/



DROP SCHEMA IF EXISTS ProjectDatabase;
CREATE SCHEMA ProjectDatabase;
USE ProjectDatabase;

CREATE TABLE Users (
    userID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,             /* primary key */
    first_name VARCHAR(255) NOT NULL, /* VARCHAR only takes up the amount of space it needs so we might as well let people have long names since it won't take up extra space */
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    googleToken VARCHAR(255),
    prefInvite VARCHAR(1) DEFAULT("1"),
    prefDelete VARCHAR(1) DEFAULT("1"),
    prefRespond VARCHAR(1) DEFAULT("1"),
    prefConfirm VARCHAR(1) DEFAULT("1"),
    PRIMARY KEY (userID)
);

CREATE TABLE Systems_Admins (
    userID SMALLINT UNSIGNED NOT NULL,             /* primary key & foreign key */
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notifID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,            /* primary key */
    notifTitle VARCHAR(255) NOT NULL,
    notifContent VARCHAR (2555) NOT NULL,
    userID SMALLINT UNSIGNED NOT NULL,             /* foreign key */
    timestamp DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
    PRIMARY KEY (notifID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

CREATE TABLE Events (
    eventID VARCHAR(255) NOT NULL DEFAULT(UUID()),            /* primary key */
    eventName VARCHAR(255) NOT NULL,
    eventDesc VARCHAR(555),
    eventStatus VARCHAR(255) NOT NULL DEFAULT("Pending"),
    hostID SMALLINT UNSIGNED NOT NULL,             /* foreign key */
    eventLocation VARCHAR(255),
    eventType VARCHAR(255),
    eventStartTime VARCHAR(255),
    eventEndTime VARCHAR(255),
    eventPoll SMALLINT UNSIGNED UNIQUE,          /* foreign key */
    PRIMARY KEY (eventID),
    FOREIGN KEY (hostID) REFERENCES Users(userID) ON DELETE CASCADE
);

CREATE TABLE Poll (
    pollID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,             /* primary key */
    pollStartTime1 VARCHAR(255),
    pollEndTime1 VARCHAR(255),
    pollStartTime2 VARCHAR(255),
    pollEndTime2 VARCHAR(255),
    pollStartTime3 VARCHAR(255),
    pollEndTime3 VARCHAR(255),
    eventID VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (pollID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE
);

ALTER TABLE Events ADD FOREIGN KEY (eventPoll) REFERENCES Poll(pollID) ON DELETE CASCADE;

CREATE TABLE Invitees (
    inviteesID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,            /* primary key */
    invitees_first_name VARCHAR(255),
    invitees_last_name VARCHAR(255),
    invitees_email VARCHAR(255),
    invitees_username VARCHAR(255) DEFAULT("Guest"), /*Guest users are identified by their username being Guest*/
    vote_choice1 INT,
    vote_choice2 INT,
    vote_choice3 INT,
    invitees_status VARCHAR(255) NOT NULL DEFAULT("Pending"),
    eventID VARCHAR(255) NOT NULL,            /* foreign key */
    userID SMALLINT UNSIGNED,             /* foreign key */
    PRIMARY KEY (inviteesID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);