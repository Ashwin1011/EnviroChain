var utils = require('./utils');
var config = require('./config')
var bigNumber = require('bignumber.js');

function Robochain(contractAddress, web3Instance) {
    // var compiled = require(filePath)
    this.address = contractAddress
    // this.abi = JSON.parse(compiled.interface)
    this.abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_numberOfTokens",
                    "type": "uint32"
                }
            ],
            "name": "buyTokens",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_index",
                    "type": "uint256"
                }
            ],
            "name": "getData",
            "outputs": [
                {
                    "name": "_temp",
                    "type": "string"
                },
                {
                    "name": "_humid",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "date",
                    "type": "uint256"
                },
                {
                    "name": "_temp",
                    "type": "string"
                },
                {
                    "name": "_humid",
                    "type": "string"
                }
            ],
            "name": "storeData",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "sweepFunds",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_data",
                    "type": "string"
                }
            ],
            "name": "Datasent",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "data",
            "outputs": [
                {
                    "name": "temp",
                    "type": "string"
                },
                {
                    "name": "humid",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "tokenBalance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
    this.web3 = web3Instance
    this.contract = new this.web3.eth.Contract(this.abi, this.address)
}

Robochain.prototype.upload = async function (privKey, date, temp, humid) {
    try {
        let pk = '0x' + privKey
        let sender = await this.web3.eth.accounts.privateKeyToAccount(pk).address;
        // console.log(sender);


        let contractData = this.contract.methods.storeData(date, temp, humid).encodeABI()
        let rawTx = {
            gasLimit: this.web3.utils.toHex(config.contractGasLimit),
            data: contractData,
            from: sender,
            to: this.address
        };
        txInfo = await utils.getTxInfo(sender);
        rawTx.nonce = txInfo.nonceHex;
        rawTx.gasPrice = this.web3.utils.toHex('20000000000');
        let signedTx = utils.signTx(rawTx, privKey)
        let txHash = await utils.submitTransaction(signedTx)
        return txHash
    }
    catch (err) {
        console.error('upload_error', err);
        throw err
    }
}

Robochain.prototype.buyTokens = async function (privKey, amount, number) {
    try {
        let pk = '0x' + privKey
        let sender = await this.web3.eth.accounts.privateKeyToAccount(pk).address;
        // console.log(sender);


        let contractData = this.contract.methods.buyTokens(number).encodeABI()
        let rawTx = {
            gasLimit: this.web3.utils.toHex(config.contractGasLimit),
            data: contractData,
            from: sender,
            to: this.address,
            value: this.web3.utils.toHex(amount)
        };
        txInfo = await utils.getTxInfo(sender);
        rawTx.nonce = txInfo.nonceHex;
        rawTx.gasPrice = this.web3.utils.toHex('20000000000');
        let signedTx = utils.signTx(rawTx, privKey)
        let txHash = await utils.submitTransaction(signedTx)
        return txHash
    }
    catch (err) {
        console.error('buyTokens_error', err);
        throw err
    }
}

Robochain.prototype.getData = async function (privKey, index) {
    try {
        let pk = '0x' + privKey
        let address = await this.web3.eth.accounts.privateKeyToAccount(pk).address;
        let bal = await this.contract.methods.tokenBalance(address).call()
        //  console.log("Data:"+data)
        if (bal > 0) {

            let sender = await this.web3.eth.accounts.privateKeyToAccount(pk).address;
            // console.log(sender);
            let contractData = this.contract.methods.getData(index).encodeABI()
            let rawTx = {
                gasLimit: this.web3.utils.toHex(config.contractGasLimit),
                data: contractData,
                from: sender,
                to: this.address
            };
            txInfo = await utils.getTxInfo(sender);
            rawTx.nonce = txInfo.nonceHex;
            rawTx.gasPrice = this.web3.utils.toHex('20000000000');
            let signedTx = utils.signTx(rawTx, privKey)
            let txHash = await utils.submitTransaction(signedTx)
            if (txHash) {
                let data = await this.contract.methods.data(index).call()
                return data
            }

        }
        else {
            return ("Token balance not sufficient")
        }

    }
    catch (err) {
        console.error('getData_error', err);
        throw err
    }
}

Robochain.prototype.sweepFunds = async function (privKey) {
    try {
        let pk = '0x' + privKey
        let sender = await this.web3.eth.accounts.privateKeyToAccount(pk).address;
        // console.log(sender);


        let contractData = this.contract.methods.sweepFunds().encodeABI()
        let rawTx = {
            gasLimit: this.web3.utils.toHex(config.contractGasLimit),
            data: contractData,
            from: sender,
            to: this.address
        };
        txInfo = await utils.getTxInfo(sender);
        rawTx.nonce = txInfo.nonceHex;
        rawTx.gasPrice = this.web3.utils.toHex('20000000000');
        let signedTx = utils.signTx(rawTx, privKey)
        let txHash = await utils.submitTransaction(signedTx)
        return txHash
    }
    catch (err) {
        console.error('SweepFunds_error', err);
        throw err
    }
}



Robochain.prototype.balanceOf = async function (address) {
    try {
        let data = await this.contract.methods.tokenBalance(address).call()
        return data
    }
    catch (err) {
        console.error('Contract_transfer_error', err);
        throw err
    }
}
module.exports = Robochain
