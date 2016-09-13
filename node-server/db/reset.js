const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/timezones';

const client = new pg.Client(connectionString);
client.connect();
client.query("DROP TABLE users;").on('end', function() {
  client.query("CREATE TABLE users(id SERIAL PRIMARY KEY, person_id VARCHAR(100) NOT NULL UNIQUE, display_name VARCHAR(100) NOT NULL, timezone VARCHAR(100) NOT NULL DEFAULT 'PST')")
        .on('end', function() { client.end(); });
});
