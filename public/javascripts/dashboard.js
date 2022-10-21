var vueinst = new Vue({
    el: '#dash',
    data: {
        show_inbox: 1,
        dash_date: new Date(),
        userID: '',
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
        users: [],
        pending_events: [],
        confirmed_events: [],
        Email: '',
        newUsername: '',
        passwordToUpdateUsername: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        prefInvite: true,
        prefDelete: true,
        prefConfirm: true,
        prefRespond: true,
        Notifications: [],
        noNotes: false,
        mon_date: '',
        tue_date: '',
        wed_date: '',
        thu_date: '',
        fri_date: '',
        sat_date: '',
        sun_date: '',
    },
    methods: {
        check_if_admin: function(id) {
            var vue = this; //Must always do this to use vue with AJAX!
            // var userID =
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var response = JSON.parse(this.responseText);
                    if (response.length !== 0) {
                        // console.log("calling next function");
                        window.location.replace("management.html");
                    } else {
                        vueinst.show_inbox = 4;
                    }
                }
            };
            xhttp.open("POST", "/admin/checkIfManager", true);
            xhttp.send();
        },
        update_notifications: function() {
            var vue = this; //Must always do this to use vue with AJAX!
            var preferences = {delete: vue.prefDelete, confirm: vue.prefConfirm, respond: vue.prefRespond, invite: vue.prefInvite};
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    alert("Preferences successfully updated!");
                }
            };
            xhttp.open("POST", "/users/update_email_pref", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(preferences)); //send email to use in the SQL queries
        },
        update_email: function() {
            var vue = this; //Must always do this to use vue with AJAX!
            var email = vue.Email;

            //Check for spaces before username or blank field
            if(/^\s/.test(email)){
                email = '';
            }

            //If input is empty, return, don't continue with function
            if(email === ''){
                alert("Error: New email field is blank or invalid (starts with space(s))");
                return;
            }

            else{
                var checkEmail = {email: email};
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var response = JSON.parse(this.responseText);
                    if (response.length == 0) {
                        vue.update_email2();
                    } else {
                        alert("Email already in use");
                    }
                }
            };
            xhttp.open("POST", "/users/validateEmail", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(checkEmail)); //send email to use in the SQL queries
            }

        },
        update_email2: function() {
            var vue = this; //Must always do this to use vue with AJAX!
            var email = vue.Email;
            var newEmail = {email: email};
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    window.location.reload();
                    alert("Email updated");
                }
            };
            xhttp.open("POST", "/users/updateEmail", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newEmail));
        },

        checkUsernameInDatabase: function(){


            var vue = this;
            var newUsername = {newUsername:vue.newUsername};

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var response = JSON.parse(this.responseText);

                    if (response.length === 0) {
                        vue.changeUsername();
                    } else {
                        alert("Username already in use");
                        return;
                    }
                }

            };
            xhttp.open("POST", "/users/checkUsernameInDatabase", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newUsername));
        },

        changeUsername: function(){

            var vue = this;


                //Check for spaces before username or blank field
                if(/^\s/.test(vue.newUsername)){
                    vue.newUsername = '';
                }

                //If input is empty, return, don't continue with function
                if(vue.newUsername === ''){
                    alert("Error: New username field is blank or invalid (starts with space(s))");
                    return;
                }

                else{

                    var newUsername = {newUsername:vue.newUsername};

                    var xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200){

                        alert("Username changed!");
                        location.reload();
                    }

                };
                xhttp.open("POST", "/users/changeUsername", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(newUsername));

                }

        },

        getHashedPassword: function() {


            var vue = this;

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var hashedPassword = JSON.parse(this.responseText);


                    vue.updatePassword1(hashedPassword[0].password);


                    }


            };
            xhttp.open("POST", "/users/getHashedPasswordForUpdate", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify());


        },


        updatePassword1: function(hashedPassword) {


            var vue = this;

            //Get hashed password
            //var hashedPassword = vue.getHashedPassword();


            var xhttp = new XMLHttpRequest();

            var passwords = {hashPassword: hashedPassword, passwordInput:vue.oldPassword};
            // console.log("Hashed password in updatePassword1 = " + hashedPassword[0].password);
            // console.log("Hashed password in updatePassword1 = " + passwords.hashPassword);

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var blanksCheck = vue.checkForBlanks();

                    if(blanksCheck === 500){
                        return;
                    }

                    else{

                        if(vue.checkPasswordsMatch() === 200){

                            vue.updatePassword2();

                        }
                        else if(vue.checkPasswordsMatch() === 400){
                            alert("New cannot be the same as old password");
                            return;
                        }
                        else if(vue.checkPasswordsMatch() === 500){
                            alert("New password and confirmation DO NOT match");
                            return;
                        }

                    }

                        }

                        else if (this.readyState == 4 && this.status !== 200){
                            alert("Incorrect old password"); //Makes pop up to
                            return;
                        }


            };
            xhttp.open("POST", "/users/checkPassword", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(passwords));


        },

        //Check for blanks
        checkForBlanks: function() {


            var vue = this;

            //Prevent blank spaces, changes them to empty strings to be processed later
            if(/^\s/.test(vue.newPassword)){
                vue.newPassword = '';
                alert("Invalid: New password is blank or starts with space");
            }

            if(/^\s/.test(vue.confirmNewPassword)){
                vue.confirmNewPassword = '';
                alert("Invald: Confirm new password is blank or starts with space");
            }

            //If input is empty, return, don't continue with function
            if(vue.newPassword === '' || vue.confirmNewPassword === ''){
                alert("Error: New password and/or confirm new password field is blank or invalid");
                return 500;
            }

        },

        checkPasswordsMatch: function (){


            if(this.newPassword === this.confirmNewPassword && this.newPassword !== this.oldPassword){
                return 200;
            }
            else if(this.newPassword === this.confirmNewPassword && this.newPassword === this.oldPassword){
                return 400;
            }
            else if(this.newPassword !== this.confirmNewPassword){
                return 500;
            }

        },

        updatePassword2: function(){


            var vue = this;

            var xhttp = new XMLHttpRequest();

            var newPassword = {newPassword:vue.newPassword};

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                        alert("Password changed!");
                        location.reload(); //Reloads page

                    }

            };
            xhttp.open("POST", "/users/changePassword", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newPassword));


        },

        get_notif_prefs: function(){ //get the current email settings for display
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var user = JSON.parse(this.responseText); //retreieve the details back
                    if (user[0].prefDelete === '0'){
                        vue.prefDelete = false;
                    }
                    if (user[0].prefInvite === '0'){
                        vue.prefInvite = false;
                    }
                    if (user[0].prefConfirm === '0'){
                        vue.prefConfirm = false;
                    }
                    if (user[0].prefRespond === '0'){
                        vue.prefRespond = false;
                    }
                }
            };
            xhttp.open("GET", "/users/get_current_user", true);
            xhttp.send();
        },
        get_notifications: function(){ //get the current users notification list
            var vue = this; //Must always do this to use vue with AJAX!
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    vue.Notifications = JSON.parse(this.responseText); //retreieve the details back
                    if (vue.Notifications.length === 0){
                        vue.noNotes = true;
                    }
                }
            };
            xhttp.open("GET", "/users/get_notifications", true);
            xhttp.send();

        },

        display_event: function(){
            var vue = this;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var events = JSON.parse(this.responseText);
                    vue.pending_events = [];
                    vue.confirmed_events = [];
                    const today = new Date();
                    vue.sun_date = (new Date (today.setDate(today.getDate() - today.getDay()))).toString().split(' ').splice(1,3).join(' ');
                    vue.mon_date = (new Date (today.setDate(today.getDate() - today.getDay() + 1))).toString().split(' ').splice(1,3).join(' ');
                    vue.tue_date = (new Date (today.setDate(today.getDate() - today.getDay() + 2))).toString().split(' ').splice(1,3).join(' ');
                    vue.wed_date = (new Date (today.setDate(today.getDate() - today.getDay() + 3))).toString().split(' ').splice(1,3).join(' ');
                    vue.thu_date = (new Date (today.setDate(today.getDate() - today.getDay() + 4))).toString().split(' ').splice(1,3).join(' ');
                    vue.fri_date = (new Date (today.setDate(today.getDate() - today.getDay() + 5))).toString().split(' ').splice(1,3).join(' ');
                    vue.sat_date = (new Date (today.setDate(today.getDate() - today.getDay() + 6))).toString().split(' ').splice(1,3).join(' ');
                    for(let i =0; i< events.length; i++){
                        if(events[i].eventStatus === 'Pending'){
                            vue.pending_events.push(events[i]);
                        }
                        else if (events[i].eventStatus !== 'Pending')
                        {
                            var time = (new Date (events[i].eventStartTime).toString().split(' ').splice(1,3).join(' '));
                            vue.confirmed_events.push(events[i]);
                            if (time === vue.mon_date)
                            {
                                vue.monday.push(events[i]);
                            }
                            else if (time === vue.tue_date)
                            {
                               vue.tuesday.push(events[i]);
                            }
                            else if (time === vue.wed_date)
                            {
                               vue.wednesday.push(events[i]);
                            }
                            else if (time === vue.thu_date)
                            {
                                vue.thursday.push(events[i]);
                            }
                            else if (time === vue.fri_date)
                            {
                                vue.friday.push(events[i]);
                            }
                            else if (time === vue.sat_date)
                            {
                                vue.saturday.push(events[i]);
                            }
                            else if (time === vue.sun_date)
                            {
                                vue.sunday.push(events[i]);
                            }
                        }
                    }
                }
            };
            xhttp.open("GET", "/event/get_user_event_details", true);
            xhttp.send();

        },

        load_eventpage: function(index,table){
            var vue = this;
            if (table === 0){ //pending events
                window.location="Event.html?eventID="+vue.pending_events[index].eventID;
            }
            else if (table === 1){
                window.location="Event.html?eventID="+vue.monday[index].eventID;
            }
            else if (table === 2){
                window.location="Event.html?eventID="+vue.tuesday[index].eventID;
            }
            else if (table === 3){
                window.location="Event.html?eventID="+vue.wednesday[index].eventID;
            }
            else if (table === 4){
                window.location="Event.html?eventID="+vue.thursday[index].eventID;
            }
            else if (table === 5){
                window.location="Event.html?eventID="+vue.friday[index].eventID;
            }
            else if (table === 6){
                window.location="Event.html?eventID="+vue.saturday[index].eventID;
            }
            else if (table === 7){
                window.location="Event.html?eventID="+vue.sunday[index].eventID;
            }
            else if (table === 8){
                window.location="Event.html?eventID="+vue.confirmed_events[index].eventID;
            }
        },
    },
    mounted: function(){
        this.get_notif_prefs();
        this.get_notifications();
        this.display_event();
    }
});