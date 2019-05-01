// app/routes.js
var mongojs = require('mongojs');
var dbUrl = require("../config/db");

//
module.exports = function (app) {
    app.get('/Contract/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        var contract = require('../config/contract');
        db.Orders.find({ 'importer': req.params.id }).count(function (err, count) {
            db.Orders.find({ 'importer': req.params.id }).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.expoter) }, function (err, DocE) {
                        DocM.ExporterName = DocE.companyname;
                        if (DocM.customs != undefined) {
                            db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.customs) }, function (err, DocC) {
                                DocM.CustomsName = DocC.companyname;
                                db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.insurance) }, function (err, DocI) {
                                    DocM.InsuranceName = DocI.companyname;
                                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.shipper) }, function (err, DocS) {
                                        DocM.ShipperName = DocS.companyname;
                                        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.customsdestination) }, function (err, DocS) {
                                            DocM.CustomsNameDestination = DocS.companyname;
                                            data.push(DocM);
                                            i = i + 1;
                                            if (i == count) {
                                                res.json(data);
                                            }
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            data.push(DocM);
                            i = i + 1;
                            if (i == count) {
                                res.json(data);
                            }
                        }
                    });
                }
            });
        });
    });

    app.get('/ShipmentDetail/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, DocM) {
            if (DocM) {
                db.LOCUsers.find({ _id: { $in: [mongojs.ObjectId(DocM.consignee), mongojs.ObjectId(DocM.shippingcompany)] } }, function (err, DocC) {
                    if (DocC[0].UserType == "Shipping Company") {
                        DocM.ShippingCompanyName = DocC[0].companyname;
                        DocM.ConsigneeName = DocC[1].companyname;
                    }
                    else {
                        DocM.ShippingCompanyName = DocC[1].companyname;
                        DocM.ConsigneeName = DocC[0].companyname;
                    }
                    res.json(DocM);
                });
            }
        });
    });
    app.get('/GetShipperShipments/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ 'shipper': req.params.id }).count(function (err, count) {
            db.Orders.find({ 'shipper': req.params.id }).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocE) {
                        DocM.ConsigneeName = DocE.companyname;
                        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.shippingcompany) }, function (err, DocS) {
                            DocM.ShippingCompanyName = DocS.companyname;
                            db.SmartContracst.findOne({bolid: JSON.stringify(DocM._id).replace(/"/g, "") }, function(err,DocC){
                                if(DocC != null){
                                DocM.TransactionCode = DocC.contractaddress;}
                                data.push(DocM);
                                i = i + 1;
                                if (i == count) {
                                    res.json(data);
                                }
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/GetShippIngCompanyShipments/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ $and: [{ 'shippingcompany': req.params.id }, { $or: [{'status':'Send To Shipping Company' },{'status':'Accepted By Shipping Company'}]}]}).count(function (err, count) {
            db.Orders.find({ $and: [{ 'shippingcompany': req.params.id }, { $or: [{'status':'Send To Shipping Company' },{'status':'Accepted By Shipping Company'}]}]}).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocE) {
                        DocM.ConsigneeName = DocE.companyname;
                        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.shipper) }, function (err, DocS) {
                            DocM.ShipperName = DocS.companyname;
                            db.SmartContracst.findOne({bolid: JSON.stringify(DocM._id).replace(/"/g, "") }, function(err,DocC){
                                if(DocC != null){
                                DocM.TransactionCode = DocC.contractaddress;}
                                data.push(DocM);
                                i = i + 1;
                                if (i == count) {
                                    res.json(data);
                                }
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/GetReadyToLoadShipments/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ $and: [{ 'shippingcompany': req.params.id }, { 'status': 'Send For Loading'}]}).count(function (err, count) {
            db.Orders.find({ $and: [{ 'shippingcompany': req.params.id }, { 'status': 'Send For Loading'}]}).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.consignee) }, function (err, DocE) {
                        DocM.ConsigneeName = DocE.companyname;
                        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.shipper) }, function (err, DocS) {
                            DocM.ShipperName = DocS.companyname;
                            db.SmartContracst.findOne({bolid: JSON.stringify(DocM._id).replace(/"/g, "") }, function(err,DocC){
                                if(DocC != null){
                                DocM.TransactionCode = DocC.contractaddress;}
                                data.push(DocM);
                                i = i + 1;
                                if (i == count) {
                                    res.json(data);
                                }
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/ContractGetCutomsOutgoing/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ $and: [{ 'customsdestination': req.params.id }, { 'insurancestatus': 'Approved' }] }).count(function (err, count) {
            db.Orders.find({ $and: [{ 'customsdestination': req.params.id }, { 'insurancestatus': 'Approved' }] }).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.importer) }, function (err, DocE) {
                        DocM.ImporterName = DocE.companyname;
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

    app.get('/ContractGetInsurance/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ 'insurance': req.params.id }).count(function (err, count) {
            db.Orders.find({ 'insurance': req.params.id }).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.expoter) }, function (err, DocE) {
                        DocM.ExporterName = DocE.companyname;
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

    app.get('/ContractGetInsuranceClaims/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var i = 0;
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        db.Orders.find({ $and: [{ 'insurance': req.params.id }, { 'status': 'Insurance Claimed' }] }).count(function (err, count) {
            db.Orders.find({ $and: [{ 'insurance': req.params.id }, { 'status': 'Insurance Claimed' }] }).forEach(function (err, DocM) {
                if (DocM) {
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.expoter) }, function (err, DocE) {
                        DocM.ExporterName = DocE.companyname;
                        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.importer) }, function (err, DocE) {
                            DocM.ImporterName = DocE.companyname;
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

    app.get('/ExpoterList/', ensureAuthorized, function (req, res) {
        var db = mongojs(dbUrl.url, ['LOCUsers']);
        db.LOCUsers.find({ UserType: 'Expoter' }, { companyname: 1 }, function (err, doc) {
            res.json(doc);
        });
    });

    app.get('/getimpoterddldata/', ensureAuthorized, function (req, res) {
        var db = mongojs(dbUrl.url, ['LOCUsers']);
        db.LOCUsers.find({ UserType: { $in: ['Customs', 'Shipper', 'Insurer'] } }, { companyname: 1, UserType: 1 }, function (err, doc) {
            res.json(doc);
        });
    });

    app.post('/ShipperSave', ensureAuthorized, function (req, res) {
        var s = req.body.date;
        var dateD = new Date(s.split('T')[0]);
        //req.body.status = "With Shipper";
       // req.body.handovershippingdate = dateD.toDateString();
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.insert(req.body, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {res.json("OK");}
        });
    });



    app.post('/3plSave', ensureAuthorized, function (req, res) {
       // var s = req.body.date;
        //var dateD = new Date(s.split('T')[0]);
        //req.body.status = "With Shipper";
       // req.body.handovershippingdate = dateD.toDateString();
        var db = mongojs(dbUrl.url, ['Logistics']);
        db.Logistics.insert(req.body, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {res.json("OK");}
        });
    });

    app.post('customerSave', ensureAuthorized, function (req, res) {
       // var s = req.body.date;
        //var dateD = new Date(s.split('T')[0]);
        //req.body.status = "With Shipper";
       // req.body.handovershippingdate = dateD.toDateString();
        var db = mongojs(dbUrl.url, ['Customers']);
        db.Customers.insert(req.body, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {res.json("OK");}
        });
    });


app.get('/LOC', function (req, res) {
  console.log('I received a GET request');
  var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
  db.Logistics.find(function (err, docs) {
  console.log(docs);  
  res.json(docs);
  }); 
});

/*app.get('/LOCFORM', function (req, res) {
  console.log('I received a GET request');
  var db = mongojs('mongodb://35.192.49.74:27017/admin', ['news']);
  db.news.find(function (err, docs) {
  console.log(docs);  
  res.json(docs);
  }); 
});
*/



    
    


    
    app.put('/AcceptShipmentShippingCompany/:id', ensureAuthorized, function (req, res) {
        //Update the shipment to say "Accepted by the shipping company"
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { status: "Accepted By Shipping Company" } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {res.json("OK");}
        });
    });

    app.put('/ShippingComapanySave/', ensureAuthorized, function (req, res) {
        var id = req.body.ShipmentID;
        
        var s = req.body.receivedgoodsondate;
        var e = req.body.expecteddateofloading;
        var date_receivedgoodsondate = new Date(s.split('T')[0]);
        var date_expecteddateofloading = new Date(e.split('T')[0]);

        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update:  { $set: { status: "Send For Loading", receivedgoodsondate: date_receivedgoodsondate.toDateString(), billofladingno : req.body.billofladingno,
            carrierscac: req.body.carrierscac,carriername: req.body.carriername,oceanvesselname: req.body.oceanvesselname,placeofreceipt: req.body.placeofreceipt,
            portofdischarge: req.body.portofdischarge,bolissued: req.body.bolissued, placeofdelivery: req.body.placeofdelivery,portofloading: req.body.portofloading,expecteddateofloading: date_expecteddateofloading.toDateString(),
            authorizedpersonshippingcompany: req.body.authorizedpersonshippingcompany, containerfid: req.body.containerfid, cleanorfoul: req.body.cleanorfoul, costtobepaidbyshipper: req.body.costtobepaidbyshipper,
            remarksbyshippingco: req.body.remarksbyshippingco, consignmentDataShippingCompany: req.body.consignmentDataShippingCompany } } ,
            new: false
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                //Add the new data to the contract
                var contract = require('../config/contract');
                contract.saveShippingCompanyData(doc, function(message, data){
                   if (message == "ok")
                   {res.json("OK");}
               });
            }
        });
    });

    app.put('/ContractCreateShipper/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { status: "Send To Shipping Company" } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                //Create the contract and pass all the BOL data 
                var contract = require('../config/contract');
                 contract.PublishDataContract(doc, function(message){
                   if (message == "ok")
                   {res.json("OK");}
               });
            }
        }
        );
    });

    app.put('/ContractUpdateC/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { customscomment: req.body.customscomment, customsstatus: req.body.action } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                var contract = require('../config/contract');
                contract.getData(ContractID, function (resultb) {
                    var CreateJSONString = require("../config/CreateJSON");
                    CreateJSONString.CreateJSONContractCustoms(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var contract = require('../config/contract');
                            var ContractID = JSONData.id;
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });

                });
            }
        }
        );
    });

    app.put('/ContractUpdateImpoter/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var status;
        if (req.body.action == "Approved") { status = "Delivered" }
        else if (req.body.action == "Rejected") { status = "Rejected" }
        else if (req.body.action == "Claim Insurance") { status = "Insurance Claimed" }

        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { importercomment: req.body.importercomment, importerstatus: req.body.action, status: status } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var CreateJSONString = require("../config/CreateJSON");
                var contract = require('../config/contract');
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                contract.getData(ContractID, function (resultb) {
                    var CreateJSONString = require("../config/CreateJSON");
                    CreateJSONString.CreateJSONContractCustoms(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var contract = require('../config/contract');
                            var ContractID = JSONData.id;
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });
                });
            }
        }
        );
    });
    app.put('/ContractUpdateCOutgoing/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { customsdestinationcomment: req.body.customsdestinationcomment, customsdestinationstatus: req.body.action } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                var contract = require('../config/contract');
                contract.getData(ContractID, function (resultb) {
                    var CreateJSONString = require("../config/CreateJSON");
                    CreateJSONString.CreateJSONContractCustomsOutgoing(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var contract = require('../config/contract');
                            var ContractID = JSONData.id;
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });
                });
            }
        }
        );
    });
    app.put('/ContractUpdateI/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { insurancecomment: req.body.insurancecomment, insurancestatus: req.body.action } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                var contract = require('../config/contract');
                contract.getData(ContractID, function (resultb) {
                    var CreateJSONString = require("../config/CreateJSON");
                    CreateJSONString.CreateJSONContractInsurance(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var ContractID = JSONData.id;
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });
                });
            }
        }
        );
    });

    app.put('/ContractUpdateIClaim/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        if (req.body.action == "Approved") { status = "Claim Approved" }
        else if (req.body.action == "Rejected") { status = "Claim Rejected" }
        else if (req.body.action == "Claim Insurance") { status = "Insurance Claimed" }
        var db = mongojs(dbUrl.url, ['Orders']);
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { insuranceclaimcomment: req.body.insuranceclaimcomment, insuranceclaimstatus: req.body.action, status: status } },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                var contract = require('../config/contract');
                contract.getData(ContractID, function (resultb) {
                    var CreateJSONString = require("../config/CreateJSON");
                    CreateJSONString.CreateJSONContractInsuranceClaims(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var contract = require('../config/contract');
                            var ContractID = JSONData.id;
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });
                });
            }
        }
        );
    });
    app.put('/ShipmentSend/:id', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var s = req.body.dateofshipment;
        var dateD = new Date(s.split('T')[0]);
        req.body.dateofshipment = dateD.toDateString();
        var db = mongojs(dbUrl.url, ['Orders', 'LOCUsers']);
        //db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.importer) }, function (err, DocM) {});
        db.Orders.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: {
                $set: {
                    shipper: req.body.shipper, customs: req.body.customs, insurance: req.body.insurance,
                    costofgoods: req.body.costofgoods, placeofshippment: req.body.placeofshippment, dateofshipment: req.body.dateofshipment,
                    status: "Shipment Send", insurancestatus: "Pending", shipperstatus: "Pending", customsstatus: "Pending", customsdestinationstatus: "Pending", customsdestination: req.body.customsdestination
                }
            },
            new: true
        }, function (err, doc) {
            if (err) { console.log(" Woops! The error took place here... "); }
            else {
                var CreateJSONString = require("../config/CreateJSON");
                var contract = require('../config/contract');
                var ContractID = JSON.stringify(doc._id).replace(/"/g, "");
                contract.getData(ContractID, function (resultb) {
                    CreateJSONString.CreateJSONContractExpoterS(doc, JSON.parse(resultb[0]), function (JSONData) {
                        var hash = require("../config/hash");
                        hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                            var contract = require('../config/contract');
                            contract.saveData(ContractID, JSON.stringify(JSONData), hashcode, function (result) {
                                if (result == "Saved") {
                                    res.json("OK");
                                }
                            });
                        });
                    });
                });
            }
        }
        );
    });

    app.get('/getprofileandshippingcompany/:uid', function (req, res) {
        var db = mongojs(dbUrl.url, ['LOCUsers']);
        var data = [];
        db.LOCUsers.findOne({ _id: mongojs.ObjectId(req.params.uid) }, function (err, doc) {
            doc.password == "ASWRTY";
            data.push(doc);
            db.LOCUsers.find({ UserType: { $in: ['Importer', 'Shipping Company'] } }, function (err, docs) {
                data.push(docs);
                res.json(data);
            });
        });
    });

    app.get('/LOCFORM', function (req, res) {
        console.log('I received a GET request');
        //var db = mongojs('mongodb://35.192.49.74/admin', ['news']);
        var db=mongojs(dbUrl.url, ['news']);
        db.news.find(function (err, docs) {
        console.log(docs); 
        res.json(docs);
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

/*contract.getData(idc, function (result) {
    if (DocM.customs != undefined) {
        db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.customs) }, function (err, DocC) {
            DocM.CustomsName = DocC.companyname;
            db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.insurance) }, function (err, DocI) {
                DocM.InsuranceName = DocI.companyname;
                db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.shipper) }, function (err, DocS) {
                    DocM.ShipperName = DocS.companyname;
                    db.LOCUsers.findOne({ _id: mongojs.ObjectId(DocM.customsdestination) }, function (err, DocS) {
                        DocM.CustomsNameDestination = DocS.companyname;
                        data.push(DocM);
                        data.push(JSON.parse(result[0]));
                        res.json(data);
                    });
                });
            });
        });
    }
    else {
        data.push(DocM);
        data.push(JSON.parse(result[0]));
        res.json(data);
    }
});*/