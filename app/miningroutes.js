// app/routes.js
var mongojs = require('mongojs');
var dbUrl = require("../config/db");

module.exports = function (app) {
    app.get('/drug', ensureAuthorized, function (req, res) {
        var db = mongojs(dbUrl.url, ['UraniumStockPile']);
        db.UraniumStockPile.find(function (err, docs) {
            res.json(docs);
        });
    });

    app.get('/drug/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['UraniumStockPile']);
        db.UraniumStockPile.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            res.json(doc);
        });
    });

    app.post('/drug', ensureAuthorized, function (req, res) {
        var db = mongojs(dbUrl.url, ['UraniumStockPile']);
        req.body.status = "Not Shipped";
        db.UraniumStockPile.insert(req.body, function (err, docs) {
            var CreateJSONString = require("../config/CreateJSON");
            CreateJSONString.CreateJSONStock(docs, function (JSONData) {
                var hash = require("../config/hash");
                hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                    var contract = require('../config/contract');
                    contract.saveData(JSONData.id, JSON.stringify(JSONData), hashcode, "", function (result) {
                        if (result == "Saved")
                        {
                              res.json("OK"); 
                        }
                    });
                });
            });
        });
    });

        app.delete('/drug/:id', ensureAuthorized, function (req, res) {
            var id = req.params.id;
            var db = mongojs(dbUrl.url, ['UraniumStockPile']);
            db.UraniumStockPile.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
                if (err)
                { console.log(" Woops! The error took place here... "); }
                else
                { res.json(doc); }

            });
        });

        app.get('/uraniumstatus/:id', ensureAuthorized, function (req, res) {
            var id = req.params.id;
            var data = [];
            var i = 0;
            var db = mongojs(dbUrl.url, ['AppUsers', 'UraniumStockPile', 'UraniumShipmentMining']);
            db.UraniumShipmentMining.find({ 'miningcompanyid': id }).count(function (err, count) {
                db.UraniumShipmentMining.find({ 'miningcompanyid': id }).forEach(function (err, DocM) {
                    if (DocM) {
                        db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocD) {
                            DocM.consignee = DocD.organisationname;
                            db.UraniumStockPile.findOne({ _id: mongojs.ObjectId(DocM.stockID) }, function (err, DocD) {
                                DocM.lotnumber = DocD.lotnumber;
                                DocM.productname = DocD.productname;
                                DocM.containernumber = DocD.containernumber;
                                data.push(DocM);
                                i = i + 1;
                                if (i == count) {
                                    res.json(data);
                                }
                            });
                        });
                    }
                });
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