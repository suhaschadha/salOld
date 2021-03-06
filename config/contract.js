var fs = require('fs');
var contractPath = './contract/DataContract1.sol';
var Web3 = require('web3');
var NodeURL = "http://13.232.15.124:22000";  
var account = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';
var PrivateTo = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=";
var dbUrl = require("../config/db");
var contractFolder = '../contract/';


module.exports = {
  PublishDataContract: function (doc, callback) {
    fs.readFile(contractPath, 'utf8', function read(err, data) {
      if (err) {
        throw err;
      }
      var contractcontent = data;
      if (typeof web3 !== 'undefined') 
      {web3 = new Web3(web3.currentProvider);}
      else {web3 = new Web3(new Web3.providers.HttpProvider(NodeURL));}
        web3.eth.defaultAccount = account;
        var simpleCompiled = web3.eth.compile.solidity(contractcontent);
        var simpleRoot = Object.keys(simpleCompiled)[0];
        var simpleContract = web3.eth.contract(simpleCompiled[simpleRoot].info.abiDefinition);
        var abiDefinition = simpleCompiled[simpleRoot].info.abiDefinition;
        console.log(JSON.stringify(simpleCompiled[simpleRoot].info.abiDefinition));
        var simple = simpleContract.new(JSON.stringify(doc), { from: web3.eth.defaultAccount, data: simpleCompiled[simpleRoot].code, gas: 30000000, privateFor: [PrivateTo] }, function (e, contract) {
          if (e) {
            console.log("err creating contract:", e);
          } else {
            if (!contract.address) {
              var transactionHash = contract.transactionHash;
              var contractaddress = contract.address;
              console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
            } else {
              var transactionHash = contract.transactionHash;
              var contractaddress = contract.address;
              console.log("Contract mined! Address: " + contract.address);
              //Save all the contract details in MongoDB
              var mongojs = require('mongojs');
              var db = mongojs(dbUrl.url, ['SmartContracst']);
              var cData = { 'bolid': JSON.stringify(doc._id).replace(/"/g, ""), 'abi': abiDefinition, 'contractaddress': contractaddress, 'contracthash': transactionHash };
              db.SmartContracst.insert(cData, function (err, doc) {
                if (err) { console.log(" Woops! The error took place here... "); }
                else { callback('ok', doc); }
              });
            }
          }
        });
      
    });
  },
  saveShippingCompanyData: function (doc, callback) {
    var mongojs = require('mongojs');
    var db = mongojs(dbUrl.url, ['SmartContracst']);
    db.SmartContracst.findOne({ bolid: JSON.stringify(doc._id).replace(/"/g, "") }, function (err, docc) {
      if (docc) {
        if (typeof web3 !== 'undefined') {
          web3 = new Web3(web3.currentProvider);
        }
        else {
            web3 = new Web3(new Web3.providers.HttpProvider(NodeURL));}
          var address = docc.contractaddress;
          var abi = docc.abi;
          var MyContract = web3.eth.contract(abi).at(address);
          var flag = MyContract.setShippingCompanyData(JSON.stringify(doc), {from:web3.eth.coinbase, privateFor:[PrivateTo]});  
          callback("ok");
        }
      
    });

  }
};
