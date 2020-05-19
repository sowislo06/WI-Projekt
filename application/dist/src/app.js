"use strict";
var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Julia ist die BESTE!');
});
let station = require('../dist/query.js');
app.get('/query', function (req, res) {
    station.query
        .then((response) => {
        let carsRecord = JSON.parse(response);
        console.log('TEST');
        res.send(carsRecord);
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=app.js.map