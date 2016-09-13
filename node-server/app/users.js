// postgres database
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/timezones';

// simple HTTP request client
var request = require('request');

const GAPI_KEY = 'AIzaSyA6rXF3jA95hpD1i944AOAwwr91FM_hb8E';

module.exports = {
  currentUser (req, res) {
    // get userId from token
    var personId = req.user.userId;

    // send userId to Google for person info
    request('https://www.googleapis.com/plus/v1/people/' + personId + '?key=' + GAPI_KEY, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        userWithPersonId(personId).then(function (user) {
          res.json({user: user});
        }).catch(function (err) {
          var displayName = JSON.parse(body).displayName;
          pg.connect(connectionString, function(err, client, done) {
            // insert row
            client.query("INSERT INTO users(person_id, display_name) VALUES($1, $2);", [personId, displayName]);
            done();
            userWithPersonId(personId).then(function (user) {
              res.json({user: user});
            });
          });
        });
      } else {
        console.log('\tFailed to validate Google Token');
        res.send({});
      }
    });
  },
  allUsers (req, res) {
    new Promise(function (resolve, reject) {
      const results = [];
      pg.connect(connectionString, function(err, client, done) {
        // check for connection error
        if (err) {
          reject(err);
          return;
        }

        // select all users
        const query = client.query("SELECT * FROM users ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
          results.push(userFromRow(row));
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
          done();
          resolve(results);
        });
      });
    }).then(function (results) {
      res.json({users: results});
    }).catch(function (err) {
      res.json({error: err});
    });
  },
  updateCurrentUser (req, res) {
    // get userId from token
    var userId = req.params.user_id;
    var newTimezone = req.body.user.timezone;

    pg.connect(connectionString, function(err, client, done) {
      // check for connection error
      if (err) {
        reject(err);
        return;
      }

      // update row
      const query = client.query("UPDATE users SET timezone=$1 WHERE id=$2;", [newTimezone, userId]);

      query.on('end', function() {
        done();
        req.body.user.id = userId;
        res.json(req.body);
      });
    });
  }
};

function userWithPersonId (personId) {
  return new Promise(function (resolve, reject) {
    const results = [];
    pg.connect(connectionString, function(err, client, done) {
      // check for connection error
      if (err) {
        reject(err);
        return;
      }

      // select for user
      const query = client.query("SELECT * FROM users WHERE person_id=$1;", [personId]);

      // Stream results back one row at a time
      query.on('row', function(row) {
        results.push(userFromRow(row));
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
        done();
        if (results.length) {
          resolve(results[0]);
        } else {
          reject('No User Found!');
        }
      });
    });
  });
}

function userFromRow (row) {
  return {
    id: row.id,
    personId: row.person_id,
    displayName: row.display_name,
    timezone: row.timezone
  };
}
