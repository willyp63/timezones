// express framework for routing
var express = require('express');

// create and validate json web tokens
var createJWT = require('jsonwebtoken');
var validateJWT = require('express-jwt');

// decodes json in the body of a request and stores it as req.body
var bodyParser = require('body-parser');

// simple HTTP request client
var request = require('request');

// startup and listen on port 4500
var app = express();
app.listen('4500', function () {
  console.log('listening on: 4500');
});

// setup HTTP headers
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Content-Type', 'application/json');
  next();
});

// respond w/ token to POST request to /get-token
app.post('/get-token', bodyParser.json(), function (req, res) {
  // get Google token from Ember: { password: googleToken }
  var googleToken = req.body.password;

  // send token to Google for validation
  request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + googleToken, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('\tGoogle Token Valid');
      var userId = JSON.parse(body).user_id;
      app.sendToken(res, userId);
    } else {
      console.log('\tFailed to validate Google Token');
      res.send({});
    }
  });
});

// Refresh token
app.post('/refresh-token', bodyParser.json(), function(req, res) {
  // verify token and extract contents (including userId)
  var oldToken = req.body.token;
  createJWT.verify(oldToken, app.secret, function (err, decodedToken) {
    if (!err) {
      // send new token
      console.log('\tRefreshing token for user ', decodedToken.userId);
      app.sendToken(res, decodedToken.userId);
    } else {
      // send error
      console.log('\tError while trying to refresh token:', err);
      res.send({});
    }
  });
});

// secret used to construct json web token
app.secret = '09htfahpkc0qyw4ukrtag0gy20ktarpkcasht';
app.gapiKey = 'AIzaSyA6rXF3jA95hpD1i944AOAwwr91FM_hb8E';

// send token to user that contains their id
app.sendToken = function (res, userId) {
  var token = createJWT.sign(
    // payload
    { userId: userId },
    // secret
    app.secret,
    // options
    {expiresIn: '2m'}
  );
  res.send({ token: token });
  console.log('\tsent token');
};

// User requests list of notes
app.get('/api/users/me', validateJWT({secret: app.secret}), function(req, res) {
  // get userId from token
  var userId = req.user.userId;

  // send userId to Google for person info
  request('https://www.googleapis.com/plus/v1/people/' + userId + '?key=' + app.gapiKey, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('\tGoogle Token Valid');
      var displayName = JSON.parse(body).displayName;
      res.send({
        user: {
          id: userId,
          displayName: displayName
        }
      });
    } else {
      console.log('\tFailed to validate Google Token');
      res.send({});
    }
  });
});
