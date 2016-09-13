// create json web tokens
var createJWT = require('jsonwebtoken');

// simple HTTP request client
var request = require('request');

// secret used to construct json web token
const JWT_SECRET = '09htfahpkc0qyw4ukrtag0gy20ktarpkcasht';

module.exports = {
  getToken (req, res) {
    // get Google token from Ember: { password: googleToken }
    var googleToken = req.body.password;

    // send token to Google for validation
    request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + googleToken, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var userId = JSON.parse(body).user_id;
        sendToken(res, userId);
      } else {
        console.log('\tFailed to validate Google Token');
        res.send({});
      }
    });
  },
  refreshToken (req, res) {
    // verify token and extract contents (including userId)
    var oldToken = req.body.token;
    createJWT.verify(oldToken, JWT_SECRET, function (err, decodedToken) {
      if (!err) {
        // send new token
        sendToken(res, decodedToken.userId);
      } else {
        // send error
        console.log('\tError while trying to refresh token:', err);
        res.send({});
      }
    });
  }
};

// send token to user that contains their id
function sendToken (res, userId) {
  var token = createJWT.sign(
    // payload
    { userId: userId },
    // secret
    JWT_SECRET,
    // options
    {expiresIn: '10m'}
  );
  res.send({ token: token });
};
