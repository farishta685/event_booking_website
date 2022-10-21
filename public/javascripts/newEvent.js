
var vueinst = new Vue({
    el: "#main_NE",
    data: {
        info: true,  //info is the first div so it starts as true
        invite: false,
        time: false,
        confirm: false,
        typeError: false, //will trigger the error messages for required input
        nameError: false,
        locationError: false,
        descError: false,
        width: 0,
        eventType: 'what type of an event is this?',
        eventName: '',
        eventLocation: '',
        eventDesc: '',
        host: {},
        searchUsers: '', //binded to the search box to search users
        allUsers: [], //an array of all the users to be filtered and suggested for the guestlist
        filteredUsers: [], //an array of all users that match the search term
        guestList: [], //an array that will contain the invited users
        guestError: false,
        dropdown: false,
        range1: {
            start: new Date(2022, 5, 13),
            end: new Date(2022, 5, 13),
          },
          range2: {
            start: new Date(2022, 5, 23),
            end: new Date(2022, 5, 23),
          },
          range3: {
            start: new Date(2022, 5, 14),
            end: new Date(2022, 5, 16),
          },
          masks: {
            input: ["YYYY-MM-DD HH:mm", "YYYY/MM/DD HH:mm"],
            inputDateTime24hr: ["YYYY-MM-DD HH:mm", "YYYY/MM/DD HH:mm"],
            is24hr: true,
          },
    },
    methods: {
        hide: function (show){
            if (show === "invite"){ //if we are trying to go from info to invites
                this.check_input(); //check if all input fields have been filled
                if (this.typeError === false && this.nameError === false && this.locationError === false && this.descError === false){
                    this.info = false; //if all input is good, we can progress
                    this.invite = false;
                    this.time = false;
                    this.confirm = false;
                    this[show] = true;
                    this.progress();
                }
            }
            else if (show === "time"){ //ensure that the guest list isnt empty before moving on
                this.guestError = false;
                if (this.guestList.length === 0){
                    this.guestError = true;
                }
                else{
                    this.info = false;
                    this.invite = false;
                    this.time = false;
                    this.confirm = false;
                    this[show] = true;
                    this.progress();
                }
            }
            else{ //for the other divs that don't need input validation
            this.info = false;
            this.invite = false;
            this.time = false;
            this.confirm = false;
            this[show] = true;
            this.progress();
            }
        },
        progress: function(){ //progresses the progress bar
            this.width = this.width + 33.3333;
        },
        getUsers: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    vue.allUsers = JSON.parse(this.responseText); //retreieve the details back
                    vue.removeHost(); //remove the host from the list of users so they can't invite themselves
                    vue.filteredUsers = vue.allUsers;
                }
            };
            xhttp.open("GET", "/users/get_users", true);
            xhttp.send();
        },
        removeHost: function(){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var host = this.responseText; //save the userID sent back, they are the host
                    for (let i = 0; i < vue.allUsers.length; i++){
                        if (vue.allUsers[i].userID == host){
                            vue.host = vue.allUsers[i]; //save the host for later
                            vue.allUsers.splice(i, 1);
                        }
                    }
                }
            };
            xhttp.open("GET", "/users/get_session_userID", true);
            xhttp.send();
        },
        addGuest: function(index){
            var guest = this.filteredUsers[index];
            this.guestList.push(guest); //add to guestList, remove from user list so they can't select the same person twice
            for (let i = 0; i < this.allUsers.length; i++){
                if (this.allUsers[i].userID === guest.userID){ //look for the guest in the whole list and remove them
                    this.allUsers.splice(i, 1);
                }
            }
            this.filteredUsers.splice(index, 1); //then remove them from the filtered list
        },
        remove_guest: function(index){
            //this.filteredUsers.push(this.guestList[index]);
            this.allUsers.push(this.guestList[index]);
            this.guestList.splice(index, 1); //must use splice like this to make vue rerender
        },
        search_users: function(){
            this.filteredUsers = [];
            for (let i = 0; i < this.allUsers.length; i++){
                if (this.allUsers[i].first_name.toLowerCase().includes(this.searchUsers.toLowerCase()) || this.allUsers[i].last_name.toLowerCase().includes(this.searchUsers.toLowerCase()) || this.allUsers[i].username.toLowerCase().includes(this.searchUsers.toLowerCase())){
               //if (Object.values(this.allUsers[i]).toLowerCase().includes(this.searchUsers.toLowerCase())){
                    this.filteredUsers.push(this.allUsers[i]);
                }
            }
            if (this.filteredUsers.length === 0){ //if no results
                var empty = {username: "No search results found!",first_name: "Try a different search term"}; //instead of doing something special, just making up an object with the message inside
                this.filteredUsers.push(empty);
            }
        },
        check_input: function(){
            this.typeError = false; //reset errors incase they have already triggered some
            this.descError = false;
            this.locationError = false;
            this.nameError = false;
            if (this.eventType !== "Casual" && this.eventType !== "Formal"){
                this.typeError = true;
            }
            if (this.eventName === ''){
                this.nameError = true;
            }
            if (this.eventDesc === ''){
                this.descError = true;
            }
            if (this.eventLocation === ''){
                this.locationError = true;
            }

        },
        go_back: function(){ //allows the progress bar to go backwards
            this.width = this.width - 66.6666;
            if (this.width < 0){ //bounds checking since math is dumb
                this.width = 0;
            }
            if (this.width > 100){
                this.width = 100;
            }

        },
        createEvent: function(){ //adds the info to the database once the host confirms
            var vue = this; //Must always do this to use vue with AJAX!
            var eventDetails = {name: vue.eventName, type: vue.eventType, location: vue.eventLocation, desc: vue.eventDesc, guests: vue.guestList};
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var id = JSON.parse(this.responseText); //retreieve the new event id back
                    vue.createPoll(id[0].eventID);
                    //console.log(id[0].eventID);
                    //window.location.replace("Event.html?eventID="+id[0].eventID); //and redirect to the new event page
            }

            };
            xhttp.open("POST", "/event/confirm_event", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(eventDetails)); //send the details
        },
        createPoll: function(eventID){
            var id = eventID; //saving the parameter
            var vue = this; //Must always do this to use vue with AJAX!
            var eventDetails = {id: id, pollStartTime1: vue.range1.start, pollEndTime1: vue.range1.end, pollStartTime2: vue.range2.start, pollEndTime2: vue.range2.end, pollStartTime3: vue.range3.start, pollEndTime3: vue.range3.end};
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.createGuests(id);
            }

            };
            xhttp.open("POST", "/event/create_poll", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(eventDetails)); //send the eventID
        },
        createGuests: function(eventID){ //create the guests in the database, one at a time
            var ids = [];
            for (let i = 0; i < this.guestList.length; i++){ //Filter userID out of the whole guestlist
                ids.push(this.guestList[i].userID);
            }
            ids.push(this.host.userID); //add in the host as well
            for (let i = 0; i < ids.length;i++){
            var vue = this; //Must always do this to use vue with AJAX!
            var eventDetails = {id: eventID, guest: ids[i]};
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    if (i !== ids.length-1){ //dont email the host the invite
                        vue.emailInvitees(eventID);
                    }
                    //window.location.replace("Event.html?eventID="+id); //and redirect to the new event page
            }
            };
            xhttp.open("POST", "/event/create_guests", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(eventDetails)); //send the event details
        }
        },
        emailInvitees: function(eventID){
            var vue = this;
            var url = location.origin + "/Event.html?eventID=" + eventID;
            for (let i = 0; i < this.guestList.length; i++){
                var emailDetails = {eventID: eventID,recipient: this.guestList[i].email, subject: "You have been invited to "+vue.eventName+"!", text: "someone has invited you to an event! <a href="+url+">Click on this link to respond</a>", userID: this.guestList[i].userID};
                if (emailDetails.userID != 'NULL'){
                    vue.addToInbox(emailDetails);
                }
                if (this.guestList[i].prefInvite != '0'){ //check email prefs before sending an email
                    this.sendEmail(emailDetails);
                }
            }
            window.location.replace("Event.html?eventID="+eventID); //and redirect to the new event page
        },
        sendEmail: function(emailDetails){
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    //we never get here
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
        }
    },
    mounted: function(){
        this.getUsers();
    },
});
