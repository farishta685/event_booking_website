var vueinst = new Vue({ // for all the managing stuffs
    el: '#manage',
    data: {
        managing: 1,
        userID: '',
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        eventID: '',
        hostID: '',
        eventName: '',
        eventDesc: '',
        admins: [],
        users: [],
        events: [],
        wantChangeUserDetails: false,
        newUsername: '',
        newPassword: '',
        userIDIndex: 1,
    },
    methods: {
        see_managers: function(){ //gets all the managers from the sql database
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    vue.admins = JSON.parse(this.responseText); //retreieve the details back
                }
            };
            xhttp.open("GET", "/admin/get_managers", true);
            xhttp.send();
        },
        see_users: function(){ //gets all the users from the sql database
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    vue.users = JSON.parse(this.responseText); //retreieve the details back
                }
            };
            xhttp.open("GET", "/admin/get_users", true);
            xhttp.send();
        },
        see_events: function(){ //gets all the events from the sql database
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    vue.events = JSON.parse(this.responseText); //retreieve the details back
                }
            };
            xhttp.open("GET", "/admin/get_events", true);
            xhttp.send();
        },
        delete_event: function(index){ //deletes the event from the database and reloads the page
            if(confirm("Confirm to delete this event.")){
                var vue = this; //Must always do this to use vue with AJAX!
                var eventID = vue.events[index].eventID;
                var event_to_delete = {eventID: eventID};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        window.location.reload(); // reload the page
                        alert("Event sucessfully removed");
                    }
                };
                xhttp.open("POST", "/admin/delete_event", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(event_to_delete)); //send the event id to use in the SQL queries
            }
        },
        delete_admin: function(index){ //deletes the admin from the database and reloads the page
            if(confirm("Confirm to remove this user as an admin.")){
                var vue = this; //Must always do this to use vue with AJAX!
                var userID = vue.admins[index].userID;
                var admin_to_remove = {userID: userID};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        window.location.reload();
                        alert("Admin sucessfully removed");
                    }
                };
                xhttp.open("POST", "/admin/delete_admin", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(admin_to_remove)); //send admin user id to use in the SQL queries
            }
        },
        delete_user: function(index) { //deletes the user from the database and reloads the page
            if(confirm("Confirm to remove this user.")){
                var vue = this; //Must always do this to use vue with AJAX!
                var userID = vue.users[index].userID;
                var user_to_remove = {userID: userID};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        window.location.reload();
                        alert("User sucessfully removed");
                    }
                };
                xhttp.open("POST", "/admin/delete_user", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(user_to_remove)); //send the user id to use in the SQL queries
            }
        },
        /* OLD METHOD OF DELETING USER INVOLVING CALLING ALL EVENTS THEY ARE THE HOST OF AND EVERWHERE THEY ARE AN INVITEE AND DELETING EACH ONE
        delete_user: function(index) {
            if(confirm("Confirm to remove this user as an admin.")){
                var vue = this; //Must always do this to use vue with AJAX!
                var userID = vue.users[index].userID;
                var user_to_remove = {userID: userID};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        vue.delete_users_events(user_to_remove); // call function to delete events the user is a host of
                        vue.delete_user_as_invitees(user_to_remove); // call function to delete their status as an event invitee
                        window.location.replace("management.html");
                        alert("User sucessfully removed");
                    }
                };
                xhttp.open("POST", "/admin/delete_user", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(user_to_remove)); //send the details
            }
        },
        delete_users_events: function(user_to_remove){ //deletes the event from the database and reloads the page
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    // for each event the user is a host of, call delete_event
                }
            };
            xhttp.open("GET", "/admin/retrieve_events_of_deleting_user", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        },
        delete_user_as_invitees: function(user_to_remove){ //deletes the event from the database and reloads the page
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    // for each of the events the user is invited to, remove them from the invitee list
                }
            };
            xhttp.open("POST", "/admin/delete_user", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(id)); //send the event id to use in the SQL queries
        }
        END */
        promote_admin: function(index){ //adds the admin to the database and reloads the page
            if(confirm("Confirm to add this user as an admin.")){
                var vue = this; //Must always do this to use vue with AJAX!
                var userID = vue.users[index].userID;
                var admin_to_promote = {userID: userID};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200){
                        window.location.reload();
                        alert("Admin sucessfully promoted");
                    }
                };
                xhttp.open("POST", "/admin/promote_admin", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(admin_to_promote)); //send admin user id to use in the SQL queries
            }
        },
        check_if_admin: function(id) {
            var vue = this; //Must always do this to use vue with AJAX!
            // var userID =
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var response = JSON.parse(this.responseText);
                    if (response.length !== 0) {
                        //you are admin, you may access
                    } else {
                        window.location.replace("index.html"); //you are not admin, you typed in the url, go away
                    }
                }
            };
            xhttp.open("POST", "/admin/checkIfManager", true);
            xhttp.send();
        },

        adminWantChangeUsername: function(id){

            var idIndex = this.users[id].userID;
            this.wantChangeUserDetails = true;
            this.userIDIndex = idIndex;

        },

        adminWantChangePassword: function(id){
            var idIndex = this.users[id].userID;
            this.wantChangeUserDetails = true;
            this.userIDIndex = idIndex;
        },


        adminUpdateUsername: function() {
            var vue = this; //Must always do this to use vue with AJAX!

            if(/^\s/.test(vue.newUsername)){
                vue.newUsername = '';
                alert("Invalid: New user is blank or starts with space");
            }

            //If input is empty, return, don't continue with function
            if(vue.newUsername === ''){
                alert("Error: New user is blank or starts with space");
                return;
            }

            else{

                var userDetails = {userID: vue.userIDIndex, newUsername: vue.newUsername};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200){
                            alert("Username changed!");
                            location.reload(); //Reloads page

                    }
                };
                xhttp.open("POST", "/admin/adminUpdateUsername", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(userDetails));

            }

        },

        adminUpdatePassword: function() {
            var vue = this; //Must always do this to use vue with AJAX!

            if(/^\s/.test(vue.newPassword)){
                vue.newPassword = '';
                alert("Invalid: New user is blank or starts with space");
            }

            //If input is empty, return, don't continue with function
            if(vue.newPassword === ''){
                alert("Error: New user is blank or starts with space");
                return;
            }

            else{

                var userDetails = {userID: vue.userIDIndex, newPassword: vue.newPassword};
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200){
                            alert("Password changed!");
                            location.reload(); //Reloads page

                    }
                };
                xhttp.open("POST", "/admin/adminUpdatePassword", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(userDetails));

            }

        }


    },
    mounted: function() {
        this.check_if_admin();
        this.see_managers();
    }
});