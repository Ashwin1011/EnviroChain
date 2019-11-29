const utils = require('./utils');
const config = require('./config');
//const compiled = require('./build/:DappToken.json')
const Robochain = require('./Robochain');
var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));



async function testDeployedContract() {
    try {
        var contractObj = new Robochain('0x833e336377248ef5ffa713b38b034776ca55c208', web3)
        // let txHash = await contractObj.upload('99AEFD83452290F6B4CA17D9950ED6856FEE24FCCF2BE3FD30489DA9B72815B4',21092019,"41.5","47.8")
        // console.log(txHash)
        // let txHash = await contractObj.buyTokens('99AEFD83452290F6B4CA17D9950ED6856FEE24FCCF2BE3FD30489DA9B72815B4',100,10)
        // console.log(txHash)
        // let bal = await contractObj.balanceOf('0x00BEFBec4AA42230E88b8fF6291Aeba25a5eb887')
        // console.log("Balance :", bal);

        let txHash = await contractObj.getData('99AEFD83452290F6B4CA17D9950ED6856FEE24FCCF2BE3FD30489DA9B72815B4','21092019')
         console.log(txHash)
        // let txHash = await contractObj.sweepFunds('99AEFD83452290F6B4CA17D9950ED6856FEE24FCCF2BE3FD30489DA9B72815B4')
        // console.log(txHash)

       
        
    }
    catch (err) {
        console.error(err);
    }
}


testDeployedContract() 
// testCompileContract("ERC20Token")
