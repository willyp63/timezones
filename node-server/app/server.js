// express framework for routing
var express = require('express');

// validate json web tokens
var validateJWT = require('express-jwt');

// decodes json in the body of a request and stores it as req.body
var bodyParser = require('body-parser');

// secret used to construct json web token
const JWT_SECRET = '09htfahpkc0qyw4ukrtag0gy20ktarpkcasht';

const Tokens = require('./tokens');
const Users = require('./users');

// startup and listen on port 4500
var app = express();
const port = process.env.PORT || 4500;
app.listen(port, function () {
  console.log(`listening on *:${port}`);
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
app.post('/get-token', bodyParser.json(), Tokens.getToken);

// Refresh token
app.post('/refresh-token', bodyParser.json(), Tokens.refreshToken);

// SHOW Logged in User
app.get('/api/users/me', validateJWT({secret: JWT_SECRET}), Users.currentUser);

// INDEX User
app.get('/api/users', Users.allUsers);

// PATCH Logged in User
app.put('/api/users/:user_id', validateJWT({secret: JWT_SECRET}), bodyParser.json(), Users.updateCurrentUser);
