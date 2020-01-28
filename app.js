/* Two-Factor Auth Tutorial Code Sample
  `nexmo.verify.request` to send a temp code to a user's phone, then
  `nexmo.verify.check` to validate the code entered by the user (on the web interface)
  In this sample app, upon user registration, store the user's phone number
  (as a key) and the generated request ID (as the value) in the persist storage.
  When the user enter the PIN code, look the info up and match the PIN with the
  request ID from the storage to verify.
  Verify API Reference: https://developer.nexmo.com/api/verify
*/

'use strict';

require('dotenv').config({
  path: __dirname + '/../.env'
});

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
var expressMongoDb = require('express-mongo-db');
var User = require('./models/user');

app.use(bodyParser.json()); // for parsing POST req
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
var config = require('./config')
app.use(expressMongoDb(config.database.url));

mongoose.connect('mongodb://localhost:27017/engine', {  useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.set('views', __dirname + '/views'); // Render on browser
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/views'));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const BRAND_NAME = 'Nexmo';
const NEXMO_API_KEY = 'fc8ba588';
const NEXMO_API_SECRET = 'lbikomM9aonOYCN9';

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
});

// Web UI ("Registration Form")
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


app.post('/register', (req, res) => {
  // A user registers with a mobile phone number

  var email = req.body.email;
  var password = req.body.password;
  var phoneNumber = req.body.mobile;
console.log(req.body);
    User.findOne({email:req.body.email},function(err,user){
    console.log('user'+user);
            if (!user) {
              console.log('ghjghjghjghj');
                res.redirect('/');
            } else if (!user.validPassword(password)) {
              console.log('dffghfgh');
              console.log('password'+password);
                res.redirect('/');
            }else {  console.log('ghjghjghjghj'+req.body.mobile);

            let phoneNumber = req.body.mobile;
            console.log(phoneNumber);
            nexmo.verify.request({
              number: phoneNumber,
              brand: BRAND_NAME
            }, (err, result) => {
              if (err) {
                //res.sendStatus(500);
                res.render('status', {
                  message: 'Server Error'
                });
              } else {
                console.log(result);
                let requestId = result.request_id;
                if (result.status == '0') {
                  res.render('verify', {
                    requestId: requestId
                  });
                } else {
                  //res.status(401).send(result.error_text);
                  res.render('status', {
                    message: result.error_text,
                    requestId: requestId
                  });
                }
              }
            });
            }
        });
});


// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
		name: '',	
    email: ''		,
    password:'',
    mobile: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.checkBody('name', 'Name is required').notEmpty()           //Validate name
  req.checkBody('mobile', 'mobile is required').notEmpty()             //Validate age
  req.checkBody('password', 'password is required').notEmpty()     
    req.checkBody('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()

    console.log(errors);
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
      console.log('1'+errors);
		var user = {
      name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
      password: req.sanitize('password').escape().trim(),
			mobile: req.sanitize('mobile').escape().trim(),
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
        console.log('3'+errors);
			//	req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('/', {
					title: 'Add New User',
          name: user.name,
          email: user.email,
          password: user.password,
					mobile: user.mobile
						
				})
			} else {		
        console.log('42'+errors);

			//	req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/')
				
				
			}
		})		
	}
  else {   //Display errors to user
    
    console.log('2'+errors);

		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New User',
            name: user.name,
            email: user.email,
            password: user.password,
            mobile: user.mobile
        })
    }
})


app.post('/verify', (req, res) => {
  // Checking to see if the code matches
  let pin = req.body.pin;
  let requestId = req.body.requestId;

  nexmo.verify.check({
    request_id: requestId,
    code: pin
  }, (err, result) => {
    if (err) {
      //res.status(500).send(err);
      res.render('status', {
        message: 'Server Error'
      });
    } else {
      console.log(result);
      // Error status code: https://developer.nexmo.com/api/verify#verify-check
      if (result && result.status == '0') {
        //res.status(200).send('Account verified!');
        // res.render('status', {
        //   message: 'Account verified! 🎉'
        // });
        res.redirect('/dashboard')
      } else {
        //res.status(401).send(result.error_text);
        res.render('status', {
          message: result.error_text,
          requestId: requestId
        });
      }
    }
  });
});