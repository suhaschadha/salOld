// Required Modules
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongojs = require('mongojs');
var favicon = require('serve-favicon');
var dbUrl = require("./config/db");
const DBURL = dbUrl.url;
var flag = '';

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes')(app);
require('./app/Contractroutes')(app);
require('./app/paymentroute')(app);
var abi = require("./config/abidefinition");

app.use(favicon(__dirname + '/public/Images/icon_favicons.ico'));

app.use(morgan("dev"));
//error hadler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});
process.on('uncaughtException', function (err) {
    console.log(err);
});

var server = app.listen(port, function () {
    console.log("Express server listening on port " + port);
});


var io = require('socket.io').listen(server);

setInterval(SendTempratureData, 7000);
function SendTempratureData() {
    console.log(flag);
    if (flag == 'yes') {
        io.emit('realtime message', 'yes');
    }
    else if (flag == 'almost') {
        io.emit('realtime message', 'almost');
    }
    else { io.emit('realtime message', 'no'); }

    var db = mongojs(DBURL, ['IoTData']);
    try {
        flag = 'no';
        db.IoTData.findOne({ $and: [{ 'deviceId': 'Raspberry Pi-1' }, { 'temperature': { $gt: 26, $lt: 30 } }] }, function (err, doc) {
            if (doc) { flag = 'almost'; }
            db.IoTData.findOne({ $and: [{ 'deviceId': 'Raspberry Pi-1' }, { 'temperature': { $gt: 30 } }] }, function (err, docy) {
                if (docy) { flag = 'yes'; }
            });
            db.close();
        });
    }
    catch (err) {
        console.log('Something went wrong:' + err)
    }
}

