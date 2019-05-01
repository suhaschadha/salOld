// app/routes.js
var mongojs = require('mongojs');
var dbUrl = require("../config/db");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = function (app) {
    app.get('/plant/:id', ensureAuthorized, function (req, res) {
        var plantid = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['FabricationStockPile', 'AppUsers']);
        db.FabricationStockPile.find({ 'namefacility': plantid }).count(function (err, count) {
            db.FabricationStockPile.find({ 'namefacility': plantid }).forEach(function (err, DocM) {
                if (DocM) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.fabricationcompanyid) }, function (err, DocD) {
                        DocM.Consignor = DocD.organisationname;
                        data.push(DocM);
                        i = i + 1;
                        if (i == count) {
                            res.json(data);
                        }
                    });
                }
            });
        });
    });

    app.get('/plantshipmentdetail/:id', ensureAuthorized, function (req, res) {
        var PlantId = req.params.id;
        var data = [];
        var hash = require("../config/hash");
        var contract = require('../config/contract');
        var db = mongojs(dbUrl.url, ['AppUsers', 'FabricationStockPile']);
        db.FabricationStockPile.findOne({ _id: mongojs.ObjectId(PlantId) }, function (err, DocM) {
            contract.getData(PlantId, function (result) {
                console.log(PlantId);
                db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.fabricationcompanyid) }, function (err, DocD) {
                    DocM.Consignor = DocD.organisationname;
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.namefacility) }, function (err, DocD) {
                    DocM.FaclityName = DocD.organisationname;
                    DocM.hashcode = result[1];
                    data.push(JSON.parse(result[0]));
                    data.push(DocM)
                    res.json(data);
                });
                });
            });
        });
    });

     app.post('/plant/:decision/:id', ensureAuthorized, function (req, res) {
        var ShipmentId = req.params.id;
        var decision = req.params.decision;
        if (decision =='reject')
            {decision = 'Rejected'}
        if (decision =='accept')
            {decision = 'Accepted'}
        var db = mongojs(dbUrl.url, ['FabricationStockPile']);
        db.FabricationStockPile.findAndModify({
            query: { _id: mongojs.ObjectId(ShipmentId) },
            update: { $set: { status: decision } }, new: true
        }, function (err, docs) {
            if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json("OK"); }
        });
    });
};

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Fabirication')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var uploadfile = multer({ storage: storage });

