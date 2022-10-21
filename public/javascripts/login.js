
//Login register page CheckUser function
var vueinst6 = new Vue({
    el: "#whole",
    data: {
        loginShow: true,
        registerShow: false,
        loginEmail: "",
        loginPassword: "",
        loginMessage: "",
        registerFirstName: "",
        registerLastName: "",
        registerEmail: "",
        registerConfirmEmail: "",
        registerPassword: "",
        registerConfirmPassword: "",
        registerUsername: "",
        registerMessage: ""
    },

    methods: {

        //Shows the login div and hides the register dive
        showLoginHideRegister: function(){
            if(this.loginShow === false && this.registerShow === true){
                this.loginShow = true;
                this.registerShow = false;
            }
        },

        //Shows the register div and hides the login div
        showRegisterHideLogin: function(){
            if(this.loginShow === true && this.registerShow === false){
                this.loginShow = false;
                this.registerShow = true;
            }
        },

        checkGoogleUser: function(userDetails){
            var vue = this;
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var user = JSON.parse(this.responseText);

                    if (user.length === 0 ){ //google user does not exist, register them
                        vue.registerUser(userDetails);
                    }

                    else{ //google user does exist, log them in
                        vue.sendCookie(user);
                    }
            }
            };
            xhttp.open("POST", "/users/checkGoogleUser", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(userDetails)); //send the login email entered to use in the SQL queries
        },

        checkUser: function() {
            var vue6 = this; //Set pointer
            var xhttp = new XMLHttpRequest(); //Start request
            var loginDetails = {email:vue6.loginEmail}; //Grab email from input

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var hashPass = JSON.parse(this.responseText);

                    //console.log("Vue checkUsers haspassword = " + hashPass[0].password);

                    if (hashPass.length === 0 ){

                        //console.log("User does not exist or incorrect details");
                        //vue6.loginMessage = "Email or password is incorrect";

                        vue6.loginMessage = "Email is not registered on database";
                    }

                    else{
                        //var userID = userIDobj[0].userID;
                        // console.log("User exists");
                        // console.log("Email and password are correct");
                        // vue6.loginMessage = "Welcome back!";
                        // vue6.sendCookie(userIDobj);


                        vue6.checkPassword(hashPass);
                    }
            }
            };
            xhttp.open("POST", "/users/checkEmail", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(loginDetails)); //send the login email entered to use in the SQL queries
        },

        checkPassword: function(hashPass) {

            //password:vue6.loginPassword


            var vue7 = this;

            var xhttp = new XMLHttpRequest();

            // var email = {email:vue6.loginEmail};
            // var password = {password:vue6.loginPassword};

            var loginDetails = {hashPassword: hashPass[0].password, passwordInput: vue7.loginPassword};


            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var userIDobj = JSON.parse(this.responseText);

                    if (userIDobj.length === 0 ){


                        //console.log("User does not exist or incorrect details");
                        //vue6.loginMessage = "Email or password is incorrect";


                        alert("Incorrect password");
                        vue7.loginMessage = "Incorrect password";

                    }

                    else{
                        vue7.loginMessage = "Welcome back!";
                        vue7.sendCookie(userIDobj);

                    }

            }
            else if (this.readyState == 4 && this.status == 401){
                vue7.loginMessage = "Incorrect password";
            }


            };
            xhttp.open("POST", "/users/checkPassword", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(loginDetails)); //send the login email entered to use in the SQL queries


        },

        //Login register page registerUser function
        registerUser: function(registerDetails) {


            //Create point
            var vue7 = this;
            //var registerDetails = {firstName: vue7.registerFirstName,lastName: vue7.registerLastName,email: vue7.registerEmail,confirmEmail: vue7.registerConfirmEmail,password: vue7.registerPassword,confirmPassword: vue7.registerConfirmPassword,username:vue7.registerUsername};

            //Validate input, call checkForBlanks function
            // console.log("Before Checks for Blanks called");
            // if (vue7.checkForBlanks(registerDetails) === 500){
            //     console.log("Checks for Blanks called");

            //     return;
            // }

            //console.log("Before checkExistingEmails called");

            //Check if existing email using function
            // if(vue7.checkExistingEmail(registerDetails) === 500){

            //     console.log("Checks for existingEmail called");
            //     alert("Email has already been registered");
            //     return;

            // }



            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){

                    var userIDobj = JSON.parse(this.responseText);
                    var userID = userIDobj[0].userID;

                        vue7.registerMessage = "Welcome to the family!";
                        vue7.sendCookie(userIDobj);

            }

            else if(this.readyState == 4 && this.status != 200){
                alert("Email and/or password confirmations DO NOT match");
                vue7.registerMessage = "Email or password confirmations do not match";
            }

            };
            xhttp.open("POST", "/users/registerUser", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(registerDetails)); //send the login email entered to use in the SQL queries


        },



        //Check for blanks
        checkForBlanks: function() {


            var vue7 = this;

            var registerDetails = {firstName: vue7.registerFirstName,lastName: vue7.registerLastName,email: vue7.registerEmail,confirmEmail: vue7.registerConfirmEmail,password: vue7.registerPassword,confirmPassword: vue7.registerConfirmPassword,username:vue7.registerUsername, googleToken: 'NULL'};

            //Prevent blank spaces, changes them to empty strings to be processed later
            if(/^\s/.test(registerDetails.firstName)){
                registerDetails.firstName = '';
                alert("Invalid: First name is blank or starts with space");
            }

            if(/^\s/.test(registerDetails.lastName)){
                registerDetails.lastName = '';
                alert("Invald: Last name is blank or starts with space");
            }

            if(/^\s/.test(registerDetails.email)){
                registerDetails.email = '';
                alert("Invalid: Email is blank or starts with space");
            }

            if(/^\s/.test(registerDetails.confirmEmail)){
                registerDetails.confirmEmail = '';
                alert("Invalid: Confirm email is blank or starts with space");
            }

            if(/^\s/.test(registerDetails.password)){
                registerDetails.password = '';
                alert("Invalid: Password is blank or starts with space");
            }

            if(/^\s/.test(registerDetails.confirmPassword)){
                registerDetails.confirmPassword = '';
                alert("Invalid: Confirm password is blank or starts with space");

            }

            if(/^\s/.test(registerDetails.username)){
                registerDetails.username = '';
                alert("Invalid: User is blank or starts with space");
            }

            //If input is empty, return, don't continue with function
            if(registerDetails.firstName === '' || registerDetails.lastName === '' || registerDetails.email === '' || registerDetails.confirmEmail === '' || registerDetails.password === '' || registerDetails.Confirmpassword === '' || registerDetails.username === ''){
                alert("Error: One or more fields is blank or invalid");
                return;
            }
            else{

                vue7.checkExistingEmail(registerDetails);
            }

        },

        //Check if existing email
        checkExistingEmail: function(registerDetails) {

            var vue7 = this;


            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var response = JSON.parse(this.responseText);


                    if(response.length !== 0){
                        alert("Email has already been registered");
                    }
                    else{
                        vue7.checkExistingUsername(registerDetails);
                    }

            }


            };
            xhttp.open("POST", "/users/checkExistingEmail", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(registerDetails));


        },


         //Check if existing username
         checkExistingUsername: function(registerDetails) {

            var vue7 = this;


            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    var response = JSON.parse(this.responseText);


                    if(response.length !== 0){
                        alert("Username has already been registered");
                    }
                    else{
                        vue7.registerUser(registerDetails);
                    }

            }


            };
            xhttp.open("POST", "/users/checkExistingUsername", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(registerDetails));


        },



        //Send cookie, should get called if 200 received by login and register functions
        sendCookie: function(userIDobj) {

            //var userID = userIDobj[0].userID;

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    // Simulate an HTTP redirect:
                    window.location.replace("Dashboard.html");

            }

            else if(this.readyState == 4 && this.status != 200){
                //
            }

            };
            xhttp.open("POST", "/users/cookie", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(userIDobj[0]));


        }

    }
});




