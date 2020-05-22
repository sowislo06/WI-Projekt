//Import
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Julia ist die BESTE!');
});

//START: ASSET

//IMPORT
let asset = require('./asset.js');

//CREATEASSET
app.get('/createAsset', function(req, res) {
  asset.createAsset(req.query.key, req.query.name, req.query.category, req.query.station).then((response) => {
    res.send(response);
  });
});

//END: ASSET


//START: ACTIVITY

//END: ACTIVITY


//START: CATEGORY

//IMPORT
let category = require('./category.js');

//CREATECATEGORY
//http://localhost:3000/createCategory?key=S5&name=Stift
app.get('/createCategory', function(req, res) {
  console.log('KEY' + req.query.key);
  console.log('NAME' + req.query.name);
  category.createCategory(req.query.key, req.query.name).then((response) => {
    res.send(response);
  });
});

//END: CATEGORY


//START: STATION

//IMPORT
let station = require('./station.js');

//READSTATION
app.get('/readStation', function(req, res) {
  station.readStation().then((response) => {
      let carsRecord = JSON.parse(response);
      res.send(carsRecord);
  });
});


//END: STATION

//START THE WEBSERVER
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});