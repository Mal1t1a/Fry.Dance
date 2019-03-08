// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Songs (nav TEXT, name TEXT, url TEXT, start REAL, end REAL)');
    console.log('New table Songs created!');
  }
  else
  {
    console.log('Database "Songs" ready to go!');
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getSongs', function(request, response) {
  db.all('SELECT rowid, * from Songs', function(err, rows) {
    console.log(rows);
    response.send(JSON.stringify(rows));
  });
});

app.post('/addSong', function(request, response)
{
  db.run('INSERT INTO Songs (nav, name, url, start, end) VALUES ("' + request.body.nav + '", "' + request.body.name + '", "' + request.body.url + '", "' + request.body.start + '", "' + request.body.end + '")', function(err)
  {
    if (!err)
    {
      var rid = this.lastID;
      db.all('SELECT rowid, * from Songs WHERE rowid = "' + rid + '"', function(err2, rows)
      {
        response.send(JSON.stringify(rows[0]));
      });
    }
  });
});

app.post('/editSong', function(request, response)
{
  db.run('UPDATE Songs SET nav = "' + request.body.nav + '", name = "' + request.body.name + '", url = "' + request.body.url + '", start = "' + request.body.start + '", end = "' + request.body.end + '" WHERE rowid = "' + request.body.rowid + '"');
  db.all('SELECT rowid, * from Songs WHERE rowid = "' + request.body.rowid + '"', function(err, rows) {
    response.send(JSON.stringify(rows[0]));
  });
});

app.post('/deleteSong', function(request, response)
{
  db.run('DELETE FROM Songs WHERE rowid = "' + request.body.rowid + '"');
  response.send(true);
});

app.get('/addSong', function(request, response)
{
  response.sendFile(__dirname + '/views/submit.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
