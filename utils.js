var Tx = require('ethereumjs-tx');
var config = require('./config')
const Web3 = require('web3')
const contract = require('web3-eth-contract');
// const Utils = require('web3-utils');
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

var convPriv = (privKey) => {
    return Buffer.from(privKey, 'hex')
}

var signTx = (rawTxObject, privKey) => {
    try {
        let tx = new Tx(rawTxObject);
        tx.sign(convPriv(privKey));
        let serializedTx = tx.serialize();
        // To create the txHash without broadcasting
        // var txHash = Utils.sha3(serializedTx);
        var signedTx = "0x" + serializedTx.toString('hex');
        return signedTx
    } catch (err) {
        console.log('signTx_error')
        throw err
    }
}

var submitTransaction = function (signedTx) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
            if (err) {
                console.log('submitTransaction_error');
                return reject(err)
            }
            else return resolve(txHash)
        })
    })
}

var getTxInfo = async (acc) => {
    try {
        let nonce = await web3.eth.getTransactionCount(acc)
        let gasPrice = await web3.eth.getGasPrice()
        if (!gasPrice) throw Error('Gas Price issue')
        return { gasPriceHex: web3.utils.toHex(gasPrice), nonceHex: web3.utils.toHex(nonce), gasPrice: gasPrice, nonce: nonce }
    } catch (err) {
        console.log('getTxInfo_error')
        throw err
    }
}



var transferEth = async function (accFrom, accTo, opt) {
    try {
        let rawTxObject = {
            to: accTo.address,
            gasLimit: web3.utils.toHex(config.TxGasLimit),
            from: accFrom.address,
            chainId: config.chainId,
            value: web3.utils.toHex(web3.utils.toWei(opt.amount, 'ether'))
        };
        txInfo = await getTxInfo(accFrom.address);
        if (opt.gasPrice) {
            rawTxObject.gasPrice = opt.gasPrice
            rawTxObject.nonce = txInfo.nonceHex;
        }
        else {
            rawTxObject.nonce = txInfo.nonceHex;
            rawTxObject.gasPrice = txInfo.gasPriceHex;
        }
        let signedTx = await signTx(rawTxObject, accFrom.privKey)
        let txHash = await submitTransaction(signedTx)
        return txHash
    } catch (err) {
        console.error('transferEth_error');
        throw err
    }
}




module.exports = { signTx, submitTransaction, getTxInfo, transferEth, web3, }
