var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Julia ist die BESTE!');
});

let station = require('./query.js');
app.get('/query', function(req, res) {
  console.log('1');
  station.query().then((response) => {
    console.log('2');
      let carsRecord = JSON.parse(response);
      res.send(carsRecord);
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});