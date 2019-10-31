const MeerSwaps = require('../../src/APP/swaps/MEER')
const Config = require('../config')
const meerSwaps = new MeerSwaps('testnet')



// meerSwaps.getSecretFromTxhash('3e40963e1d6ae599a720e3fc321351b14fd2657e424f39423f33f4e65403145e').then(console.log)

// return
// test private 23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7 KxQ312hbN7piLHgQ7G656RGEw97XBAcb4Ss6Xa8kexCLVbPSxqrH

/**
 *  test alice
 *  private 23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7
 *  wif KxQ312hbN7piLHgQ7G656RGEw97XBAcb4Ss6Xa8kexCLVbPSxqrH
 *  public 037da1e32c2d96f58c8d050be6f8c394c0a04518bcc42d8b292acda0b42d177153
 *  address Tmgjwv1oKCDF7Y9koCmWp234Jwy1n1evNS4
 * 
 *  test bob
 *  private 30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee
 *  wif Kxq5aKbmDD6JftpuAe6BJRab7MYtSuW8959JXA4JrDijf3muUYQP
 *  public 0260ce88ea226b2f4a2c412d218b7a47060439eb38a9b9ffdaf38e1fe0f94dc34b
 *  address TmeRp1j28asEALtNEbKcDVqZM9AYUeJ3DAn
 * 
 *  secret Key ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75
 *  secret Hash 76ca8525763881278982698e025f7bb26b838609
 */

// set Alice
// 
meerSwaps.setSender(Config.private.alice)//Config.private.alice
// meerSwaps.setSender(Config.private.bob)
console.log ( meerSwaps.sender )
meerSwaps.getBalance('TSJSdCUHF6F8j6EdABqu5TCUK34oNZkHFfP').then(console.log)
// meerSwaps.meerSearch('162243f8d28c6f1f00293efc98f090a75d4e0cd9ea3feddaacfeaf4ac47e49db').then(console.log)
// setInterval(()=>{
    // meerSwaps.faucetMeer({amount: 420}).then(console.log)
// },8000)

const dd = '63a614a16a00701f65ac9eab2e6fe48c808e123b18f72a8876a914a9c86f04570f50eb81441489c9a3983391e8aaf86704048eb55db17576a914c326c4b6b32d4e92e69b06af6c9a35fbb71563226888ac'
 
console.log (
    meerSwaps.checkContract(Buffer.from(dd, 'hex'))
) 

return
meerSwaps.sendMeer({to:[
    {address: 'TmZanYLAPAnwELLFuT5QUrhTwJ1Fwczp3GZ', amount: 4}
]}).then( e => {
    console.log (
        e
    )
})
console.log (
    meerSwaps.sender
)
return
// creatContract
const swapsContract = meerSwaps.creatSwaps({
    redeemAddress: 'TmeRp1j28asEALtNEbKcDVqZM9AYUeJ3DAn',
    refundAddress: 'Tmgjwv1oKCDF7Y9koCmWp234Jwy1n1evNS4',
    secretHash: '76ca8525763881278982698e025f7bb26b838609' 
})

/** 
 *  lockMeer
 *  addresss TSNwdZUhHgKMsSfk34RcqxLihNdHDiym5wY
 *  script 63a61476ca8525763881278982698e025f7bb26b8386098876a914a9c86f04570f50eb81441489c9a3983391e8aaf86704c85c9c5db17576a914c326c4b6b32d4e92e69b06af6c9a35fbb71563226888ac
 */

// meerSwaps.sendMeer({to:[
//     { address: swapsContract.p2shAddress, amount:0.3 }
// ]}).then( e => {
//     console.log(e)
// })

meerSwaps.getBalance('TSNwdZUhHgKMsSfk34RcqxLihNdHDiym5wY').then(console.log)

// bob redeem meer
const script = '63a61476ca8525763881278982698e025f7bb26b8386098876a914a9c86f04570f50eb81441489c9a3983391e8aaf86704c85c9c5db17576a914c326c4b6b32d4e92e69b06af6c9a35fbb71563226888ac'
meerSwaps.redeemRaw( { 
    toAddress: 'TmeRp1j28asEALtNEbKcDVqZM9AYUeJ3DAn' , 
    contractScript: Buffer.from ( script, 'hex'), 
    secret : 'ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75'
} ).then(console.log)

console.log( 
    // meerSwaps.fetchTx('bd6c400d3cbf23266bf8ffe699fc3f0f408d1c644e23f383df8be60724c72527').then( e => {
    //     console.log(e)
    // }),
    // meerSwaps.getBalance().then( e => {
    //     console.log(e)
    // }),
    swapsContract  ,
    swapsContract.contractScript.toString('hex')
    // meerSwaps.checkContract( 
    // )
)