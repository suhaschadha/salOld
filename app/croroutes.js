// app/routes.js
var mongojs = require('mongojs');
var dbUrl = require("../config/db");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = function (app) {
    app.get('/croallocatedata/:id', ensureAuthorized, function (req, res) {
        var data = { DDLData: {}, PharmaData: {} };
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['PharmaData', 'ClinicalTrailUsers']);
        db.PharmaData.find({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            data.PharmaTrailData = doc;
            db.ClinicalTrailUsers.find({ 'usertype': 'Hospital' }, function (err, docd) {
                data.DDLData = docd;
                res.json(data);
            });
        });
    });
    app.get('/fabricationddl', ensureAuthorized, function (req, res) {
        var DDLData = { AllConversion: {} };
        var db = mongojs(dbUrl.url, ['AppUsers']);
        db.AppUsers.find({ 'usertype': 'Fuel Fabrication Plant' }, function (err, docs) {
            DDLData.AllFabrication = docs;
            res.json(DDLData);
        });
    });
    app.get('/cae/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['AppUsers', 'UraniumStockPile', 'UraniumShipmentMining']);
        db.UraniumShipmentMining.find({ 'consignee': id }).count(function (err, count) {
            db.UraniumShipmentMining.find({ 'consignee': id }).forEach(function (err, DocM) {
                if (DocM) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.miningcompanyid) }, function (err, DocD) {
                        DocM.miningcompanyname = DocD.organisationname;
                        db.UraniumStockPile.findOne({ _id: mongojs.ObjectId(DocM.stockID) }, function (err, DocD) {
                            DocM.lotnumber = DocD.lotnumber;
                            DocM.productname = DocD.productname;
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
    app.get('/ceashipmentdetail/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var ShipmentDataB = {};
        var StockDataB = {};
        var ShipmentId = req.params.id;
        var ShipmentVerified = true;
        var hash = require("../config/hash");
        var contract = require('../config/contract');
        var db = mongojs(dbUrl.url, ['AppUsers', 'UraniumStockPile', 'UraniumShipmentMining']);
        db.UraniumShipmentMining.findOne({ _id: mongojs.ObjectId(ShipmentId) }, function (err, DocM) {
            hash.GetHASHforString(JSON.stringify(DocM), function (hashcode) {
                db.UraniumStockPile.findOne({ _id: mongojs.ObjectId(DocM.stockID) }, function (err, DocS) {
                    DocM.productname = DocS.productname;
                    DocM.lotnumber = DocS.lotnumber;
                    DocM.containernumber = DocS.containernumber;
                    DocM.numberofdrums = DocS.numberofdrums;
                    DocM.weight = DocS.weight;
                    DocM.packagingdate = DocS.packagingdate;
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.miningcompanyid) }, function (err, DocD) {
                        DocM.miningcompanyname = DocD.organisationname;
                        data.push(DocM);
                        var contract = require('../config/contract');
                        contract.getData(ShipmentId, function (result) {
                            data.push(JSON.parse(result[0]));
                            DocM.hashcode = result[1];
                            contract.getData(DocM.stockID, function (results) {
                                data.push(JSON.parse(results[0]));
                                res.json(data);
                            });
                        });
                    });
                });
            });

        });
    });

    app.post('/cae/:decision/:id', ensureAuthorized, function (req, res) {
        var ShipmentId = req.params.id;
        var decision = req.params.decision;
        if (decision =='reject')
            {decision = 'Rejected'}
        if (decision =='accept')
            {decision = 'Accepted'}
        var db = mongojs(dbUrl.url, ['UraniumShipmentMining']);
        db.UraniumShipmentMining.findAndModify({
            query: { _id: mongojs.ObjectId(ShipmentId) },
            update: { $set: { status: decision } }, new: true
        }, function (err, docs) {
            if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json("OK"); }
        });
    });
    
    app.get('/conversionshipment/:id', ensureAuthorized, function (req, res) {
        var conversioncompanyid = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['EnrichmentStockPile', 'AppUsers']);
        db.EnrichmentStockPile.find({ 'conversioncompanyid': conversioncompanyid }).count(function (err, count) {
            db.EnrichmentStockPile.find({ 'conversioncompanyid': conversioncompanyid }).forEach(function (err, DocM) {
                if (DocM) {
                    db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocD) {
                        DocM.consignee = DocD.organisationname;
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


    app.post('/saveshipmentfabrication/:id', uploadfile.array('file', 12), function (req, res, next) {
        var conversioncompanyid = req.params.id;
        var myFiles = req.files;
        var ShipMentFiles = {};
        var files = [];
        ShipMentFiles.files = files;

        //Get the file hash and save it in chain and then in DB
        var hash = require("../config/hash");
        for (var i = 0; i <= myFiles.length - 1; i++) {
            hash.generateFileHash('./Uploads/Conversion/' + myFiles[i].originalname, myFiles[i].originalname, function (hashcode, filename) {
                var file = {
                    "filename": filename,
                    "filehash": hashcode
                }
                ShipMentFiles.files.push(file);
                if (ShipMentFiles.files.length == myFiles.length) {
                    var NewShipment = {
                        productname: req.body.productname,
                        lotnumber: req.body.lotnumber,
                        cylindernumber: req.body.cylindernumber,
                        weight: req.body.weight,
                        packagingdate: req.body.packagingdate,
                        drumpackagecertificationreport: req.body.drumpackagecertificationreport,
                        inspectedby: req.body.inspectedby,
                        inspecteddate: req.body.inspecteddate,
                        consignee: req.body.consignee,
                        logisticsserviceprovide: req.body.logisticsserviceprovide,
                        dangerousgoodsdeclarationform: req.body.dangerousgoodsdeclarationform,
                        containernumber: req.body.containernumber,
                        containercertificateinspection: req.body.containercertificateinspection,
                        shipmentnumber: req.body.shipmentnumber,
                        dateshipment: req.body.dateshipment,
                        contractnumber: req.body.contractnumber,
                        shipmentnotificationdocumentnumber: req.body.shipmentnotificationdocumentnumber,
                        exportlicensnumber: req.body.exportlicensnumber,
                        ISOcertificatenumberforinternationallogistics: req.body.ISOcertificatenumberforinternationallogistics,
                        status: "In Transit",
                        shipmentfiles: ShipMentFiles,
                        shipmentaccepteddate: "",
                        conversioncompanyid: conversioncompanyid
                    };
                    var db = mongojs(dbUrl.url, ['EnrichmentStockPile']);
                    db.EnrichmentStockPile.insert(NewShipment, function (err, docs) {
                        var CreateJSONString = require("../config/CreateJSON");
                        CreateJSONString.CreateJSONEnrichment(docs, function (JSONData) {
                            var hash = require("../config/hash");
                            hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                                var contract = require('../config/contract');
                                var ShipmentID = JSONData.id;
                                contract.saveData(ShipmentID, JSON.stringify(JSONData), hashcode, "", function (result) {
                                    if (result == "Saved")
                                    { res.redirect('http://localhost:2000/#/caes'); }
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
        cb(null, 'uploads/conversion')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var uploadfile = multer({ storage: storage });