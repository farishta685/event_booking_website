//normal javascript functions that have cross page functionallity go here

//This function places the header onto the page
function header(){
    let xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            let header = document.getElementsByTagName("header")[0];
            header.innerHTML = this.responseText;
            }
    };
    xhttp.open('GET', '/header', true);
    xhttp.send();
}

//This function places the footer onto the page
function footer(){
    let xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            let footer = document.getElementsByTagName("footer")[0];
            footer.innerHTML = this.responseText;
            }
    };
    xhttp.open('GET', '/footer.ajax', true);

    xhttp.send();
}

//This function is used in the footer so that the about page will show the correct content based on what button is pressed
//This function makes a post request to the server to set the value of the footer button that was pressed.
//This can't be a vue function as this could occur on any page and there can only be 1 vue instance per page
function set_about_button(sent_button){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            //data is sent, nothing more to do
    }
    };
    xhttp.open("POST", "/set_about_button", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({button: sent_button}));
}

//Logout function
function logout(){

  try{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
} catch(err) {}


        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200){

              window.location.replace("index.html");
              alert("Logged out! Click OK to return to main page");

        }

        };
        xhttp.open("POST", "/users/logout", true);
        xhttp.send();
}


//Login function – Get profile information
function onSignIn(googleUser) {


  var profile = googleUser.getBasicProfile();

//This gets the users ID token:
var id_token = googleUser.getAuthResponse().id_token;

//This send the ID token to your server with an HTTPS POST request:
//Slightly different to Google website instructions
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/users/tokensignin');
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var googleID = this.responseText;
          var userDetails = {firstName: profile.getGivenName(), lastName: profile.getFamilyName(), email: profile.getEmail(), confirmEmail: profile.getEmail(), password: 'NULL', confirmPassword: 'NULL', username: profile.getName(), googleToken: googleID};
          vueinst6.checkGoogleUser(userDetails);
          alert("Google login success!");
        } else  if (this.readyState == 4 && this.status == 401) {
          // login failed
          alert("Google login failed");
        }
      };

      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({'idtoken': id_token}));
}




