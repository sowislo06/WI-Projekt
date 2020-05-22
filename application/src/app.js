var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Julia ist die BESTE!');
});

let station = require('./query.js');
app.get('/query', function(req, res) {
  station.query().then((response) => {
      let carsRecord = JSON.parse(response);
      res.send(carsRecord);
  });
});

//Link
//http://localhost:3000/createCategory?key=S5&name=Stift
app.get('/createCategory', function(req, res) {
  console.log('KEY' + req.query.key);
  console.log('NAME' + req.query.name);
  station.createCategory(req.query.key, req.query.name).then((response) => {
    res.send(response);
  });
});
/*
app.get('/p', function(req, res) {
  res.send("tagId is set to " + req.query.tagId);
});

// GET /p?tagId=5
// tagId is set to 5

*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});