const Web3 = require('web3');
const NodeURL ="http://localhost:22000";//var NodeURL = "http://54.242.222.243:22000";
const account = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';
const PrivateTo = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=";
const address = '0x61ac9bf3f53fd719697a9cd17f46c0311bf5c106';
const abi = [{ "constant": false, "inputs": [{ "name": "TempratureBreached_Data", "type": "string" }], "name": "setTempratureBreached", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTranactiosn1Data", "outputs": [{ "name": "retVal", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTempratureBreached", "outputs": [{ "name": "retVal", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Tranactiosn1Temprature", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Tranactiosn1Data", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTranactiosn1Temprature", "outputs": [{ "name": "retVal", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "Tranactiosn1Temprature_Data", "type": "string" }], "name": "setTranactiosn1Temprature", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "TempratureBreached", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "Tranactiosn1_Data", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];


if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
      else { web3 = new Web3(new Web3.providers.HttpProvider(NodeURL)); }
           
      var MyContract = web3.eth.contract(abi).at(address);
      var flag = MyContract.TempratureBreached();
      console.log(flag);
      MyContract.setTempratureBreached('no', { from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] }); 