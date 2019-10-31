const Config = require('../config')

const BtcSwaps = require('../../src/APP/swaps/BTC')

const BtcS = new BtcSwaps('testnet')

BtcS.setSender(Config.private.alice)

const bitcoin = BtcS.core
const keyPair = bitcoin.ECPair.makeRandom({network:BtcS.net, rng: () => Buffer.from(Config.private.alice, 'hex')})
const { address } =bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey ,network: BtcS.net}),
    network: BtcS.net
  })
  BtcS.getBalance( ).then(console.log)
//   BtcS.sendBtc({
//     to: [{
//         address: 'mjtFfT76vGyoCqyeYSo76ZFjbzyjV48TTu',
//         amount: 0.01
//     }]
// }).then( console.log )
console.log (
  BtcS.sender.address
)
  return
// BtcS.sendBtc( { 
//     to: [{
//         address: '1Pa7y4LKPZ75ujvi8cj9jSQoggggPmUB4y',
//         amount: 0.0001
//     }]
// } ).then(console.log)
console.log(
    BtcS.sender.address,
    address
    // BtcS.creatSwaps({
    //     redeemAddress: 'mgD78xp3ABznu3XESF52yBjCHaRNdChHQp', 
    //     refundAddress: 'mgD78xp3ABznu3XESF52yBjCHaRNdChHQp', 
    //     lockTime: '1566112120', 
    //     secretHash: 'c0933f9be51a284acb6b1a6617a48d795bdeaa80'
    // }),
    //  ,
    // BtcS.checkContract('63a614b75e2a5d3954e063a1de032caa7baed1029fa1e98876a914843043481f636dafd10cb0433d4f34456eb3c8406704800c435db17576a91446d96e0eb3f7de705b860347e451b9c41af72cd26888ac').then(console.log)
    // BtcS.getBalance( 'mgFTQe1JvBQhr4PWZE6ucTPiQmqNN8GELF' ).then(console.log),
    // BtcS.fetchUnspents( 'msZuJjb9m8pDMRNDRvaYCz9JcLTQt58RCZ', 0.0009 ).then(console.log)
    // BtcS.getFeersBySatoshis({ txIn: 1, txOut: 1 }).then( console.log )
)

// BtcS.sendBtc({
//     to: [{
//         address: 'myBUMQTmZGK8yKLDranjSQEHbCYCaaywQD',
//         amount: 0.005
//     }]
// }).then( console.log )
// // BtcS.sendTransactionTx('0200000001c65c1f165a68db47f0efcf2dbb797be071963d9a847bfb5100a34a5c8ec47664010000006b483045022100bb0c9aea26643f1b854958a65cd816ce461acdec118a3c597057a27d6d3b03fc02206ba4f0e3435527c06cda14cda367a0d6485d657525dd5193522318a24febf12b0121028b7686dff944b1a4e63d5d07794b164b2f3f563ee1f27e6002373466de754f30ffffffff02a0860100000000001976a914c1c3092d17c917c2799c041aeaeac1882277214988acecb32e00000000001976a9140809c5ecfa549dfc32b0fb75ba0a6cd8106c2c5d88ac00000000')
// .then( e => {
//     console.log( e)
// })
BtcS.fetchUnspents('myBUMQTmZGK8yKLDranjSQEHbCYCaaywQD', 10544499).then( console.log )
// return
