//vue for the about.html page

var vueinst = new Vue({
    el: "#all-about",
    data: {
        About: false,
        Contact: false,
        Privacy: false
    },
    methods: {
        div_select: function (){ //this function makes a get request when the about page loads to get the value of the footer button pressed to get
            var vue = this;      //to the about page and calls the hide function to hide all irrelevant divs
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200){
                    vue.hide(this.responseText);
            }

            };
            xhttp.open("GET", "/get_about_button", true);
            xhttp.send();
        },
        hide: function (show){
            this.About = false;
            this.Contact = false;
            this.Privacy = false;
            this[show] = true;
        }
    },
    mounted: function() {
        this.div_select();
    }
});