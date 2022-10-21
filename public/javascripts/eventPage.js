//order of functions to ensure the event page displays correctly for each user
//Event_info()
//Poll_info()
//Guest_info() --> get_poll_voters()
//Host_info()  --> checkIfUser()
//Those are the initial display functions, now to show different ascpects based on user
//checkIfUser()  check if a registered user or guest
    //if registered
    //checkHost() --> end of host functions
    //if not host
    //checkIfResponded() --> end of registered user functions
    //
    //if not - prompt them to enter details and then run..
    //checkIfNewGuest
        //if yes
        //registerGuest
        //if no - skip registerGuest
        //loginGuest()
        //Guest_info() reload guest list on page with new guest
        //checkVoteStatus()
        //checkIfResponded() --> end of guest account functions

var vueinst = new Vue({ //This is for all the event page stuff
    el: '#event-page',
    data: {
        popup: false,  //controls the display of the vote popup
        title: "", //the information we need retreive from the database to display on the page
        status: "",
        location: "",
        type: "",
        description: "",
        host: "",
        hostEmail: "", //for sending emails to the host when invitees respond
        hostID: "",
        pollStartTime1: "", //these have the format YYYY-MM-DD HH:MM for display
        pollEndTime1: "",
        pollStartTime2: "",
        pollEndTime2: "",
        pollStartTime3: "",
        pollEndTime3: "",
        pollStartTime1Cal: "", //all cal variables have the format YYYY-MM-DDTHH:MM:SS.000Z for sending to the google calendar
        pollEndTime1Cal: "",
        pollStartTime2Cal: "",
        pollEndTime2Cal: "",
        pollStartTime3Cal: "",
        pollEndTime3Cal: "",
        pollvotes1: 0,
        pollvoters1: [], //these three arrays will save the details of who votes for what so we can display them
        pollvotes2: 0,
        pollvoters2: [],
        pollvotes3: 0,
        pollvoters3: [],
        finalstartTime: "", //we show the final time here once the event is finalised
        finalendTime: "",
        finalstartTimeCal: "", //all cal variables have the format YYYY-MM-DDTHH:MM:SS.000Z for sending to the google calendar
        finalendTimeCal: "",
        finalised: false, //toggles the div to show the final time when finalised
        guestUser: false, //toggles guest user procedures
        guestFirstName: "", //register guest user information
        guestLastName: "",
        guestEmail: "",
        guestlist: [], //contains the list of users invited
        responseButtons: false, //toggles the response buttons for users
        hostAccess: false, //toggles host buttons
        finalStyle: { //when the poll disappers, make the guest window bigger
            height: '70%'
        },
        voted1: false, //removes the vote button on option 1
        voted2: false, //removes the vote button on option 2
        voted3: false, //removes the vote button on option 3
        pendingUser: false //controls if the offer to auto respond with google calender appears
    },
    methods: {
        Event_info: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var details = JSON.parse(this.responseText); //retreieve the details back
                    if (details.length !== 0){ //check that the response we got actually has content
                        vue.title = details[0].eventName; //extract each part of the details one-by-one and place them on the page
                        vue.status = details[0].eventStatus;
                        vue.location = details[0].eventLocation;
                        vue.type = details[0].eventType;
                        vue.description = details[0].eventDesc;
                        vue.finalstartTimeCal = details[0].eventStartTime;
                        vue.finalendTimeCal = details[0].eventEndTime;
                        vue.finalstartTime = new Date(details[0].eventStartTime).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(details[0].eventStartTime).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                        vue.finalendTime = new Date(details[0].eventEndTime).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(details[0].eventEndTime).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                        if (vue.status === "Confirmed"){
                            vue.finalised = true;
                        }
                    }
                    else{ //if the response has no content, the event ID doesn't exist
                        alert("This event page does not exist!");
                        window.location.replace("index.html");
                    }
                }
            };
            xhttp.open("POST", "/event/get_event_details", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries

        },
        Poll_info: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var details = JSON.parse(this.responseText); //retreieve the details back
                    vue.pollStartTime1Cal = details[0].pollStartTime1;
                    vue.pollEndTime1Cal = details[0].pollEndTime1;
                    vue.pollStartTime2Cal = details[0].pollStartTime2;
                    vue.pollEndTime2Cal = details[0].pollEndTime2;
                    vue.pollStartTime3Cal = details[0].pollStartTime3;
                    vue.pollEndTime3Cal = details[0].pollEndTime3;
                    //display times via my super hacky way to get the date string inside the databse to play nice with UTC trying to display the wrong time
                    vue.pollStartTime1 = new Date(vue.pollStartTime1Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollStartTime1Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                    vue.pollEndTime1 = new Date(vue.pollEndTime1Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollEndTime1Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                    vue.pollStartTime2 = new Date(vue.pollStartTime2Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollStartTime2Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                    vue.pollEndTime2 = new Date(vue.pollEndTime2Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollEndTime2Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                    vue.pollStartTime3 = new Date(vue.pollStartTime3Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollStartTime3Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                    vue.pollEndTime3 = new Date(vue.pollEndTime3Cal).toLocaleString('en-AU', {hour12: false}).slice(0,10) + " " + new Date(vue.pollEndTime3Cal).toLocaleString('en-AU', {hour12: false}).slice(11,17);
                }
            };
            xhttp.open("POST", "/event/get_poll_details", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        },
        Guest_info: function(){ //gets all the needed guest information from the sql database
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.guestlist = JSON.parse(this.responseText); //retreieve the details back
                    vue.get_poll_voters(); //Now that we have the guest info, call the function to count the votes
                }
            };
            xhttp.open("POST", "/event/get_guest_details", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        },
        Host_info: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var host_details = JSON.parse(this.responseText); //retreieve the details back
                    vue.host = host_details[0].username + " (" + host_details[0].first_name + " " + host_details[0].last_name + ")";
                    vue.hostEmail = host_details[0].email;
                    vue.hostID = host_details[0].userID;
                    vue.checkIfUser();
            }

            };
            xhttp.open("POST", "/event/get_host_details", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        },
        delete_event: function(){ //double checks that the user is the host and then deletes the event from the database and redirects user back to their dashboard
            if(confirm("Do you really want to delete this event?")){
                var vue = this; //Must always do this to use vue with AJAX!
                var xhttp = new XMLHttpRequest();
                let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
                var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        vue.emailInvitees(1);
                        window.location.replace("Dashboard.html");
                        alert("Event deleted sucessfully");
                }

                };
                xhttp.open("POST", "/event/delete_event", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
            }
        },
        get_poll_voters: function(){ //count how many people have voted for each choice
            this.pollvoters1 = [];
            this.pollvoters2 = [];
            this.pollvoters3 = [];
            this.pollvotes1 = 0;
            this.pollvotes2 = 0;
            this.pollvotes3 = 0; //make sure we start at 0 for each count
            for (let i = 0; i < this.guestlist.length; i++){
                if (this.guestlist[i].vote_choice1 !== null){
                    this.pollvotes1++;
                    this.pollvoters1.push(this.guestlist[i]);
                }
                if (this.guestlist[i].vote_choice2 !== null){
                    this.pollvotes2++;
                    this.pollvoters2.push(this.guestlist[i]);
                }
                if (this.guestlist[i].vote_choice3 !== null){
                    this.pollvotes3++;
                    this.pollvoters3.push(this.guestlist[i]);
                }
            }
        },
        checkHost: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            vue.hostAccess = false; //ensure that we start with the flag as false in case of shenanigans
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var id = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){ //if we get a 200 back, then the user is the host
                    vue.hostAccess = true;
                    vue.checkIfResponded();
                    vue.checkVoteStatus();
                }
                else if (this.readyState == 4 && this.status == 403){
                    vue.checkIfResponded();
                    vue.checkVoteStatus();
                }
            };
            xhttp.open("POST", "/event/checkHost", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        },
        finaliseTime: function(number){
            this.finalised = true;
            this.popup = false;
            if (number === 1){
                this.finalstartTime = this.pollStartTime1;
                this.finalendTime = this.pollEndTime1;
                this.finalstartTimeCal = this.pollStartTime1Cal;
                this.finalendTimeCal = this.pollEndTime1Cal;
            }
            else if (number === 2){
                this.finalstartTime = this.pollStartTime2;
                this.finalendTime = this.pollEndTime2;
                this.finalstartTimeCal = this.pollStartTime2Cal;
                this.finalendTimeCal = this.pollEndTime2Cal;
            }
            else if (number === 3){
                this.finalstartTime = this.pollStartTime3;
                this.finalendTime = this.pollEndTime3;
                this.finalstartTimeCal = this.pollStartTime2Cal;
                this.finalendTimeCal = this.pollEndTime2Cal;
            }
            this.finaliseDatabase();
        },
        finaliseDatabase: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var details = {eventID: params.get('eventID'), starttime: vue.finalstartTimeCal, endtime: vue.finalendTimeCal}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.eventStatus = "Confirmed"; //display that the event is confirmed
                    vue.emailInvitees(2); //send emails to invitees to tell them the confirmed time and that they can go to the event page to add to Google Calendar
                }
            };
            xhttp.open("POST", "/event/finalise", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        checkIfUser: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    if (this.responseText === "undefined"){
                        vue.guestUser = true;
                    }
                    else{
                        vue.checkHost();
                    }
                }
            };
            xhttp.open("GET", "/users/get_session_userID", true);
            xhttp.send(); //send the event id and time to use in the SQL queries
        },
        checkIfNewGuest: function(){ //check if the guest already has a guest account for this event
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var details = {eventID: params.get('eventID'), first_name: vue.guestFirstName, last_name: vue.guestLastName, email: vue.guestEmail}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var returned = JSON.parse(this.responseText);
                    if (returned.length === 0){
                        vue.registerGuestAccount();
                    }
                    else{
                        vue.loginGuest(returned[0].inviteesID);
                    }
                }
            };
            xhttp.open("POST", "/event/checkIfNewGuest", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries


        },
        registerGuestAccount: function(){ //add the guest to the invitees table
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var details = {eventID: params.get('eventID'), first_name: vue.guestFirstName, last_name: vue.guestLastName, email: vue.guestEmail}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var guestID = JSON.parse(this.responseText);
                    vue.loginGuest(guestID.id);
                }
            };
            xhttp.open("POST", "/event/registerGuest", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries

        },
        loginGuest: function(guestID){ //log the guest in with their ID from the invitees table as a seperate session variable compared to normal logged in users
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            var details = {guestID: guestID}; //sends through the user/inviteeID
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.guestUser = false;
                    let params = (new URL(document.location)).searchParams;
                    var object = {eventID: params.get('eventID')};
                    vue.Guest_info(object);
                    vue.checkIfResponded();
                    vue.checkVoteStatus();
                }
            };
            xhttp.open("POST", "/event/loginGuest", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        checkIfResponded: function(){ //check if the current user has already responded
                var vue = this; //Must always do this to use vue with AJAX!
                var xhttp = new XMLHttpRequest();
                let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
                var details = {eventID: params.get('eventID')};
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        var status = JSON.parse(this.responseText);
                        if (status[0].invitees_status === "Pending"){
                            vue.responseButtons = true;
                            vue.pendingUser = true;
                        }
                    }
                };
                xhttp.open("POST", "/event/checkIfResponded", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        respondToInvite: function(button){ //allow the user to accept the event invite and change their status to going.
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams; //retreives everything after the ? in the url
            var newStatus;
            if (button === 1){
                newStatus = "Going";
            }
            else{
                newStatus = "Rejected";
            }
            var details = {eventID: params.get('eventID'), newStatus: newStatus}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.responseButtons = false;
                    vue.pendingUser = false;
                    vue.emailInvitees(3); //send an email to inform people that someone has responded
                    var object = {eventID: params.get('eventID')};
                    vue.Guest_info(object);
                }
            };
            xhttp.open("POST", "/event/respondToInvite", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        vote: function(button){ //save users poll vote PLACE VOTED1 OR VOTED2 OR VOTED3 in the brackets for each time choice
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams;
            var details = {eventID: params.get('eventID'), choice: button}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue[button] = true;
                    vue.Guest_info();
                }
            };
            xhttp.open("POST", "/event/vote", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        unvote: function(button){ //allows users to remove their vote
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams;
            var details = {eventID: params.get('eventID'), choice: button}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue[button] = false;
                    vue.Guest_info();
                }
            };
            xhttp.open("POST", "/event/unvote", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },
        checkVoteStatus: function(){ //check the vote status for the current user
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            let params = (new URL(document.location)).searchParams;
            var details = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var votes = JSON.parse(this.responseText);
                    if (votes[0].vote_choice1 === 1){
                        vue.voted1 = true;
                    }
                    if (votes[0].vote_choice2 === 1){
                        vue.voted2 = true;
                    }
                    if (votes[0].vote_choice3 === 1){
                        vue.voted3 = true;
                    }
                }
            };
            xhttp.open("POST", "/event/checkVoteStatus", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(details)); //send the event id and time to use in the SQL queries
        },

        addToCalendar: async function(){
            var vue = this;
            var start = new Date(vue.finalstartTimeCal).toISOString();
            var end = new Date(vue.finalendTimeCal).toISOString();
            // Refer to the JavaScript quickstart on how to setup the environment:
            // https://developers.google.com/calendar/quickstart/js
            // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
            // stored credentials.

            var event = {
              'summary': vue.title,
              'location': vue.location,
              'description': vue.description,
              'start': {
                'dateTime': start, //need to do string concat eventTime, eventStartTime and eventEndTime
                'timeZone': 'Australia/Adelaide'
              },
              'end': {
                'dateTime': end,
                'timeZone': 'Australia/Adelaide'
              },
            //   'attendees': [
            //       for (let i = 0; i < vue.guestList.length; i++){
            //         {'email': vue.guestList[i].email}
            //       }
            //   ],
              'reminders': {
                'useDefault': false,
                'overrides': [
                  {'method': 'email', 'minutes': 24 * 60},
                  {'method': 'popup', 'minutes': 10}
                ]
              }
            };

            var request = gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': event
            });

            request.execute(function(event) {
            });
          },
          emailInvitees: function(emailType){
              var vue = this;
            let params = (new URL(document.location)).searchParams;
            var eventID = {eventID: params.get('eventID')}; //extracts the unique, hard to guess, event id from the url
            var url = location.origin + "/Event.html?eventID=" + eventID.eventID;
            if (emailType == 1){
                for (let i = 0; i < this.guestlist.length; i++){
                    var emailDetails = {eventID: eventID, recipient: this.guestlist[i].invitees_email, subject: ""+vue.title+" has been cancelled", text: vue.title+" has been cancelled :( Maybe it's time to make a new event?", userID: this.guestlist[i].userID};
                    if (emailDetails.userID != "NULL"){ //add the email to the users inbox in their dashboard, even if they said no emails since this isn't an email!
                        vue.addToInbox(emailDetails);
                    }
                    if (this.guestlist[i].invitees_prefDelete != '0'){ //check email prefs before sending an email
                        this.sendEmail(emailDetails);
                    }
                }
            }
            else if (emailType == 2){
                for (let i = 0; i < this.guestlist.length; i++){
                    let emailDetails = {eventID: eventID, recipient: this.guestlist[i].invitees_email, subject: vue.title+" has been confirmed!", text: vue.title+" is officially happening on the "+vue.finalstartTime+"! You can revisit <a href="+url+">the event page</a> to add the event to your Google Calendar!", userID: this.guestlist[i].userID};
                        if (emailDetails.userID != "NULL"){ //add the email to the users inbox in their dashboard, even if they said no emails since this isn't an email!
                            vue.addToInbox(emailDetails);
                        }
                    if (this.guestlist[i].invitees_prefConfirm != '0'){ //check email prefs before sending an email
                        this.sendEmail(emailDetails);
                    }
                }
            }
            else if (emailType == 3){
                for (let i = 0; i < this.guestlist.length; i++){
                    let emailDetails = {eventID: eventID, recipient: this.guestlist[i].invitees_email, subject: "Someone has responded to "+vue.title, text: "Someone has responded to "+vue.title+". Visit <a href="+url+">the event page</a> to find out who it was!", userID: this.guestlist[i].userID};
                    if (emailDetails.userID != "NULL"){ //add the email to the users inbox in their dashboard, even if they said no emails since this isn't an email!
                        vue.addToInbox(emailDetails);
                    }
                    if (this.guestlist[i].invitees_prefRespond != '0'){ //check email prefs before sending an email
                        this.sendEmail(emailDetails);
                    }
                }
            }
        },
        sendEmail: function(emailDetails){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    //this never happens
            }
            };
            xhttp.open("POST", "/email", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(emailDetails)); //send the event details
        },
        addToInbox: function(emailDetails){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    //add to inbox
            }
            };
            xhttp.open("POST", "/users/addToInbox", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(emailDetails)); //send the event details
        },
        check_availibility: function(){            // Check if we a busy and have an event on our calendar for the same time.
            var vue = this; //probably don't need this here but just in case the API changes this..

            var startTime;
            var endTime;
            if (vue.finalised === true){ //if the event is already finalised then just check the 1 time
                startTime = [vue.finalstartTimeCal];
                endTime = [vue.finalendTimeCal];
            }
            else{
                startTime = [vue.pollStartTime1Cal, vue.pollStartTime2Cal, vue.pollStartTime3Cal];
                endTime = [vue.pollEndTime1Cal, vue.pollEndTime2Cal, vue.pollEndTime3Cal];
            }
            for (let i = 1; i < startTime.length+1;i++){
                gapi.client.calendar.freebusy.query({
                    "resource": {
                    "timeMin": startTime[i-1],
                    "timeMax": endTime[i-1],
                    "timeZone": "Australia/Adelaide",
                    "items": [
                        {
                            "id": 'primary'
                        }
                    ]
                    }
                })
                    .then(function(response) {
                            // Handle the results here (response.result has the parsed body).
                            if (response.result.calendars.primary.busy.length === 0){ //we are free
                                if (vue.finalised === true){ //event is finalised, just accept the invite
                                    vue.respondToInvite(1);
                                }
                                else{ //event is pending, respond to the poll and accept invite if we haven't already
                                    vue.vote("voted"+i);
                                    if (vue.pendingUser === false){ //the first call to respond will set pendingUser to false so we can use it to check if we already responded
                                        vue.respondToInvite(1);
                                    }
                                }
                            }
                            else{ //do nothing, we will reject the invite back in the calling function if we didn't find a match
                            }
                            },
                            function(err) {
                                //console.error("Execute error", err);
                            });
                }
                if (vue.pendingUser === true){ //if we finished the for loop and never replied to the invite, reject it
                    vue.respondToInvite(2);
                }
        }
            // gapi.client.calendar.freebusy.query(
            //     {
            //         resource: {
            //         "timeMin": vueinst.finalstartTimeCal,
            //         //'2022-06-20T09:00:00-07:00',
            //         "timeMax": vueinst.finalendTimeCal,
            //         //'2022-06-20T09:00:00-09:00',
            //         "timeZone": 'Australia/Adelaide',
            //         "items": [{ id: 'primary' }],
            //         },
            //     }),
            //     (err, res) => {
            //         // Check for errors in our query and log them if they exist.
            //         if (err){
            //             console.log(err);
            //         }
            //         // Create an array of all events on our calendar during that time.
            //         const event_list = res.data.calendars.primary.busy
            //         console.log("here");

            //         // Check if event array is empty which means we are not busy
            //         if (event_list.length === 0){
            //             // If we are not busy create a new calendar event call function addToCalendar with parameter 1
            //             //if (button === 1) {
            //             //  respondToInvite(1);
            //             //}
            //             //else if (button === 2) {
            //             //  addToCalendar();
            //             free = false;
            //         }
            //             else if (event_list.length >0){
            //                 free = true;
            //                 console.log("Sorry I am busy doing super important stuff at this time!")
            //         }
            //     }

            //     console.log(free);
            //     //const free = check_availibility(startTime[i], endTime[i]);
            //     if (free == true)
            //     {
            //     await vueinst.vote(i);
            //     }
            // }
    },
    mounted: function(){
        this.Event_info();
        this.Poll_info();
        this.Guest_info();
        this.Host_info();
    },
});