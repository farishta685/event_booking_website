/* eslint-disable no-console */
/* routes that could be called from any page*/
var express = require('express');
var path = require('path');
var router = express.Router();

var nodemailer = require('nodemailer'); //NODEMAILER INCLUDE

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'tracy.blick76@ethereal.email',
      pass: 'NBppt4e1jpNHrM4wAQ'
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/header', function(req, res, next) { //get the header html. Changes based on if user is logged in
  var options = {
    root: path.join(__dirname, 'public')
  };
  if (req.session.userID === undefined){
    res.sendFile(path.join(__dirname, '../public/header-nologin.ajax'));
  }
  else{
    res.sendFile(path.join(__dirname, '../public/header-loggedin.ajax'));
  }
});

router.get('/footer.ajax', function(req, res, next) { //get the footer html
  res.send("/footer.ajax");
});

var last_button = "";
router.post('/set_about_button', function(req, res) { //uses a global variable to set the footer button that was pressed. This can be triggered from any page
  last_button = req.body.button;
  res.send();
});

router.get('/get_about_button', function(req, res, next) { //called on the about page and retreives that global variable to show the correct information
  res.send(String(last_button));
});


router.post('/email', function(req,res){ //sends emails
  let info = transporter.sendMail({
    from: '"Friday Quokka 🎉" <tracy.blick76@ethereal.email>', // sender address
    to: req.body.recipient, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.text, // plain text body
    html: "<b>"+req.body.text+"</b>", // html body
  });
});



module.exports = router;
