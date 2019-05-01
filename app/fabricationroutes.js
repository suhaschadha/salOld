// app/routes.js
var mongojs = require('mongojs');
var dbUrl = require("../config/db");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = function (app) {
    app.get('/fabrication/:id', ensureAuthorized, function (req, res) {
        var fabricationlistcompanyid = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['EnrichmentStockPile', 'AppUsers']);
        db.EnrichmentStockPile.find({ 'consignee': fabricationlistcompanyid }).count(function (err, count) {
            db.EnrichmentStockPile.find({ 'consignee': fabricationlistcompanyid }).forEach(function (err, DocM) {
                if (DocM) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.conversioncompanyid) }, function (err, DocD) {
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

    app.get('/fabricationshipmentdetail/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var ShipmentId = req.params.id;
        var hash = require("../config/hash");
        var contract = require('../config/contract');
        var db = mongojs(dbUrl.url, ['AppUsers', 'EnrichmentStockPile']);
        db.EnrichmentStockPile.findOne({ _id: mongojs.ObjectId(ShipmentId) }, function (err, DocM) {
            hash.GetHASHforString(JSON.stringify(DocM), function (hashcode) {
                contract.getData(ShipmentId, function (result) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.conversioncompanyid) }, function (err, DocD) {
                        data.push(JSON.parse(result[0]));
                        DocM.hashcode = result[1];
                        DocM.Consignor = DocD.organisationname;
                        data.push(DocM);
                        res.json(data);
                    });
                });
            });

        });
    });

    app.get('/fabricationplantshipment/:id', ensureAuthorized, function (req, res) {
        var FabricationCompanyId = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['FabricationStockPile', 'AppUsers']);
        db.FabricationStockPile.find({ fabricationcompanyid: FabricationCompanyId }).count(function (err, count) {
            db.FabricationStockPile.find({ fabricationcompanyid: FabricationCompanyId }).forEach(function (err, DocM) {
                if (DocM) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.namefacility) }, function (err, DocD) {
                        DocM.PlantName = DocD.organisationname;
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

    app.get('/NuclearPlantDDL', ensureAuthorized, function (req, res) {
        var db = mongojs(dbUrl.url, ['AppUsers']);
        db.AppUsers.find({ usertype: 'Nuclear Power Plant' }, function (err, docs) {
            res.json(docs);
        });
    });

    app.post('/fabrication/:decision/:id', ensureAuthorized, function (req, res) {
        var ShipmentId = req.params.id;
        var decision = req.params.decision;
        if (decision == 'reject')
        { decision = 'Rejected' }
        if (decision == 'accept')
        { decision = 'Accepted' }
        var db = mongojs(dbUrl.url, ['AppUsers', 'EnrichmentStockPile']);
        db.EnrichmentStockPile.findAndModify({
            query: { _id: mongojs.ObjectId(ShipmentId) },
            update: { $set: { status: decision } }, new: true
        }, function (err, docs) {
            if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json("OK"); }
        });
    });

    app.post('/createsshipmentfabrication/:id', uploadfile.array('file', 12), function (req, res, next) {
        var FabricationCompanyId = req.params.id;
        var myFiles = req.files;
        var ShipMentFiles = {};
        var files = [];
        ShipMentFiles.files = files;

        //Get the file hash and save it in chain and then in DB
        var hash = require("../config/hash");
        for (var i = 0; i <= myFiles.length - 1; i++) {
            hash.generateFileHash('./Uploads/Fabirication/' + myFiles[i].originalname, myFiles[i].originalname, function (hashcode, filename) {
                var file = {
                    "filename": filename,
                    "filehash": hashcode
                }
                ShipMentFiles.files.push(file);
                if (ShipMentFiles.files.length == myFiles.length) {
                    var NewShipment = {
                        namefacility: req.body.namefacility,
                        postaladdress: req.body.postaladdress,
                        country: req.body.country,
                        owner: req.body.owner,
                        operator: req.body.operator,
                        facilitydiscription: req.body.facilitydiscription,
                        facilitypurpose: req.body.facilitypurpose,
                        facilitylayout: req.body.facilitylayout,
                        shiftinchargename: req.body.shiftinchargename,
                        safetyinchargename: req.body.safetyinchargename,
                        status: "In Transit",
                        shipmentfiles: ShipMentFiles,
                        fabricationcompanyid: FabricationCompanyId
                    };
                    var db = mongojs(dbUrl.url, ['FabricationStockPile']);
                    db.FabricationStockPile.insert(NewShipment, function (err, docs) {
                        var CreateJSONString = require("../config/CreateJSON");
                        CreateJSONString.CreateJSONPlant(docs, function (JSONData) {
                            var hash = require("../config/hash");
                            hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                                var contract = require('../config/contract');
                                var ShipmentID = JSONData.id;
                                contract.saveData(ShipmentID, JSON.stringify(JSONData), hashcode, "", function (result) {
                                    console.log(ShipmentID);
                                    res.redirect('http://localhost:2000/#/fabrications');
                                });
                            });
                        });
                    });
                }
            });
        }
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
        cb(null, 'uploads/Fabrication')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var uploadfile = multer({ storage: storage });

