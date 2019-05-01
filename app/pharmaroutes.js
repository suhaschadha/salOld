// app/routes.js
var mongojs = require('mongojs');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var dbUrl = require("../config/db");

module.exports = function (app) {

    app.post('/saveshipmentconversion/:id', uploadfile.array('file', 12), function (req, res, next) {
        var miningcompanyid = req.params.id;
        var myFiles = req.files;
        var ShipMentFiles = {};
        var files = [];
        ShipMentFiles.files = files;
        //Get the files hash 
        var hash = require("../config/hash");
        for (var i = 0; i <= myFiles.length - 1; i++) {
            hash.generateFileHash('./Uploads/' + myFiles[i].originalname, myFiles[i].originalname, function (hashcode, filename) {
                var file = {
                    "filename": filename,
                    "filehash": hashcode
                }
                ShipMentFiles.files.push(file);
                if (ShipMentFiles.files.length == myFiles.length) {
                    var NewShipment = {
                        drumpackagecertificationreport: req.body.drumpackagecertificationreport,
                        inspected: req.body.inspected,
                        inspectiondate: req.body.inspectiondate,
                        consignee: req.body.consignee,
                        logisticsserviceprovider: req.body.logisticsserviceprovider,
                        dangerousgoodsdeclarationform: req.body.dangerousgoodsdeclarationform,
                        containercertificateofinspection: req.body.containercertificateofinspection,
                        shipment: req.body.shipment,
                        dateshipment: req.body.dateshipment,
                        exportlicense: req.body.exportlicense,
                        isocertificatenumber: req.body.isocertificatenumber,
                        contractno: req.body.contractno,
                        shipmentnotificationdocument: req.body.shipmentnotificationdocument,
                        stockID: req.body.stockID,
                        status: "In Transit",
                        shipmentfiles: ShipMentFiles,
                        shipmentaccepteddate: "",
                        miningcompanyid: miningcompanyid
                    };
                    var db = mongojs(dbUrl.url, ['UraniumShipmentMining']);
                    db.UraniumShipmentMining.insert(NewShipment, function (err, docs) {
                        var CreateJSONString = require("../config/CreateJSON");
                        CreateJSONString.CreateJSONMining(docs, function (JSONData) {
                            var hash = require("../config/hash");
                            hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                                var contract = require('../config/contract');
                                var ShipmentID = JSONData.id;
                                contract.saveData(ShipmentID, JSON.stringify(JSONData), hashcode, "", function (result) {
                                        if (result == "Saved") {//Change the status of the stock
                                            db.UraniumStockPile.findAndModify({
                                                query: { _id: mongojs.ObjectId(req.body.stockID) },
                                                update: { $set: { status: "Shipped" } },
                                                new: true
                                            }, function (err, doc) {
                                                if (err)
                                                { console.log(" Woops! The error took place here... "); }
                                                else
                                                { res.redirect('http://localhost:2000/#/ore'); }
                                            });
                                        }
                                });
                            });
                        });
                    });
                }
            });
        }
    });

    app.get('/shipmentstatus/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['UraniumShipmentMining']);
        db.UraniumShipmentMining.find({ 'miningcompanyid': id }).count(function (err, count) {
            db.UraniumShipmentMining.find({ 'miningcompanyid': id }).forEach(function (err, DocM) {
                if (DocM) {
                    db.UraniumStockPile.findOne({ _id: mongojs.ObjectId(DocM.stockID) }, function (err, DocD) {
                        DocM.lotnumber = DocD.lotnumber;
                        db.AppUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocD) {
                            DocM.consignee = DocD.organisationname;
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

    app.get('/pharmaedit/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var Data = { AllCRO: {}, AllDrug: {}, Pharma: {} };
        var db = mongojs(dbUrl.url, ['PharmaData']);
        db.PharmaData.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            Data.Pharma = doc;
            db.ClinicalTrailUsers.find({ 'usertype': 'CRO' }, function (err, docc) {
                Data.AllCRO = docc;
                db.DrugProfile.find(function (err, docd) {
                    Data.AllDrug = docd;
                    res.json(Data);
                });
            });
        });
    });

    app.get('/miningddl', ensureAuthorized, function (req, res) {
        var DDLData = { AllConversion: {} };
        var db = mongojs(dbUrl.url, ['AppUsers']);
        db.AppUsers.find({ 'usertype': 'Conversion and Enrichment' }, function (err, docs) {
            DDLData.AllConversion = docs;
            res.json(DDLData);
        });
    });


    app.get('/download/:id/:filename/:Type', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var filepath = '';
        if(req.params.Type == 'Mining')
            {filepath = './Uploads/' + req.params.filename;}
        if(req.params.Type == 'Conversion')
            {filepath = './Uploads/Conversion/' + req.params.filename;}
        if(req.params.Type == 'Fabrication')
            {filepath = './Uploads/Fabrication/' + req.params.filename;}
        //Get the HASH Code of downlading file and compare with the one in chain
        var hash = require("../config/hash");
        hash.generateFileHash(filepath , req.params.filename, function (hashcode, filename) {
            //get the hash code form BC
            var contract = require('../config/contract');
            contract.getData(id, function (result) {
                if (result != undefined) {
                    var files = JSON.parse(JSON.parse(result[0]).shipmentfiles);
                    for (var i = 0; i <= files.files.length - 1; i++) {
                        if (files.files[i].filename == req.params.filename) {
                            if (files.files[i].filehash == hashcode)
                            { res.json({ 'data': 'OK', 'filename': req.params.filename, 'type': req.params.Type }); }
                            else {
                                res.json({ 'data': 'The file is corrupt.' });
                            }
                        }

                    }

                }
            });
        });
    });

    app.get('/downloadfile/:filename/:type', function (req, res) {
        var filepath ='';
        if(req.params.type == 'Mining')
            {filepath = '/Uploads/' + req.params.filename;}
        if(req.params.type == 'Conversion')
            {filepath = '/Uploads/Conversion/' + req.params.filename;}
        if(req.params.type == 'Fabrication')  
            {filepath = '/Uploads/Fabrication/' + req.params.filename;}
                                    

        var filename = req.params.filename;
        var appDir = path.dirname(filename);
        var file = appDir + filepath;
        var mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
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
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var uploadfile = multer({ storage: storage });