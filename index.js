'use strict'
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))// to support URL-encoded bodies
const utils = require('./utils');
const config = require('./config');
const Robochain = require('./Robochain.js');
var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
var contractAddress = "0x9667621641962c953c920a3e84fd692eb4fe99ab"
var privatekey = "99AEFD83452290F6B4CA17D9950ED6856FEE24FCCF2BE3FD30489DA9B72815B4"


app.post('/upload/', async function (req, res) {
    try {
        if (!req.body.date || !req.body.temp || !req.body.humid) {
            return res.json({ "status": "error", "message": "Invalid parameters" })
        }
        var contractObj = new Robochain(contractAddress, web3)
        let txHash = await contractObj.upload(privatekey, req.body.date, req.body.temp, req.body.humid)
        if (txHash !== null) {
            return res.json({ "status": "success", "data": { "Transaction Hash": txHash } })
        }
        else {
            return res.json({ "status": "error" })
        }
    }
    catch (err) {
        console.error(err)
        return res.json({ "status": "error", "data": err })
    }
})

app.post('/buy-tokens/', async function (req, res) {
    try {
        if (!req.body.privatekey || !req.body.amount || !req.body.number) {
            return res.json({ "status": "error", "message": "Invalid parameters" })
        }
        var contractObj = new Robochain(contractAddress, web3)
        let txHash = await contractObj.buyTokens(req.body.privatekey, req.body.amount, req.body.number)
        if (txHash !== null) {
            return res.json({ "status": "success", "data": { "Transaction Hash": txHash } })
        }
        else {
            return res.json({ "status": "error" })
        }
    }
    catch (err) {
        console.error(err)
        return res.json({ "status": "error", "data": err })
    }
})


app.post('/get-data/', async function (req, res) {
    try {
        if (!req.body.privatekey || !req.body.date) {
            return res.json({ "status": "error", "message": "Invalid parameters" })
        }
        var contractObj = new Robochain(contractAddress, web3)
        let data = await contractObj.getData(req.body.privatekey, req.body.date)
        if (data !== null) {
            return res.json({ "status": "success", "data": data })
        }
        else {
            return res.json({ "status": "error" })
        }
    }
    catch (err) {
        console.error(err)
        return res.json({ "status": "error", "data": err })
    }
})

app.post('/get-token-balance/', async function (req, res) {
    try {
        if (!req.body.userAddress) {
            return res.json({ "status": "error", "message": "Invalid parameters" })
        }
        var contractObj = new Robochain(contractAddress, web3)
        let bal = await contractObj.balanceOf(req.body.userAddress)
        if (bal !== undefined) {
            return res.json({ "status": "success", "data": { "balance": bal } })
        }
        else {
            return res.json({ "status": "error" })
        }
    }
    catch (err) {
        console.error(err)
        return res.json({ "status": "error", "data": err })
    }
})


app.post('/sweep-funds/', async function (req, res) {
    try {
        if (!req.body.privatekey) {
            return res.json({ "status": "error", "message": "Invalid parameters" })
        }
        var contractObj = new Robochain(contractAddress, web3)
        let data = await contractObj.sweepFunds(req.body.privatekey)
        if (data !== null) {
            return res.json({ "status": "success", "data": data })
        }
        else {
            return res.json({ "status": "error" })
        }
    }
    catch (err) {
        console.error(err)
        return res.json({ "status": "error", "data": "Insufficient funds or unauthorized" })
    }
})

app.listen(3000, "0.0.0.0", function () {
    console.log("Robochain started");

})
