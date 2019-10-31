const ERC20Swap = require('../../src/APP/swaps/ERC20')
const abi = require('../../src/config/ERC20SwapABI')
const tokenAbi = require('../../src/config/ERC20')
/**
 *  test alice
 *  private 23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7
 *  public 037da1e32c2d96f58c8d050be6f8c394c0a04518bcc42d8b292acda0b42d177153
 *  address 0xB95fB08257DAa1F4d6458a72A95726246f7CCdD1
 * 
 *  test bob
 *  private 30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee
 *  public 0260ce88ea226b2f4a2c412d218b7a47060439eb38a9b9ffdaf38e1fe0f94dc34b
 *  address 0xffb409b7b198993cc946ba6d7874676f8FD07188
 * 
 *  secret Key ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75
 *  secret Hash 76ca8525763881278982698e025f7bb26b838609
 *  
 *  test token 0x01E899e6Bc56aac01760e3aa092129cc0BEEC25F
 *   contractAddress 0x10280cF84828Cd5ca56CF8c757A56E9dc5e288FC
 */

const contractAddress = '0x10280cF84828Cd5ca56CF8c757A56E9dc5e288FC'
const tokenAddress = '0x01E899e6Bc56aac01760e3aa092129cc0BEEC25F'

const EthSwaps = new ERC20Swap({
  abi,
  contractAddress,
  tokenAbi, 
  tokenAddress,
  network: 'testnet',
  decimals: 8
})

  EthSwaps.setSender('30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee')
 
console.log (
  EthSwaps.web3.eth.getBalance('0xB95fB08257DAa1F4d6458a72A95726246f7CCdD1').then(e => {
    console.log(e,'eeeee')
  }),
  // EthSwaps.web3.utils.hexToUtf8('0xfa89401a00000000000000000000000099f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765'),
  // EthSwaps.web3.eth.getTransaction('0xc6208e2088531a06e20b298022bf15168b59b920b5d65d1d693a296bb5487a7e').then( console.log ),
  // EthSwaps.createSwap({
  //   redeemAddress : '0x99f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765', 
  //   amount: 1, 
  //   secretHash: '5ff0bb7e2b1fe2988036a09d98bb1dca7c76c66a'
  // }).then( console.log )//0x99f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765
  // EthSwaps.getSecret('0x99f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765').then(console.log),
  // EthSwaps.redeem( '0xbc570955f8be57324541f36d0cdd0f793e96fd77e04f40cd48451ccd54a25354', '0x30cf09f1b82c0b67c3944afbed3660d39a1428b2' ).then( console.log ),
  // EthSwaps.createSwap({
  //   redeemAddress : '0x99f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765', 
  //   amount: 8, 
  //   secretHash: '5ff0bb7e2b1fe2988036a09d98bb1dca7c76c66a'
  // }).then(console.log),
  // EthSwaps.approveSwap(10).then(console.log),
  // EthSwaps.checkContract('0x99f8821a5ba7cb0e3bd4d14b1d21e0d425bf4765').then(console.log),
  
  // EthSwaps.getSecretFromTxhash('0x3ccb36cc7395974c6beef1bb23117feb8157b93a82e5ac4120a0349c4851d608').then(console.log),
  // EthSwaps.transfer(  '0x30cf09f1b82c0b67c3944afbed3660d39a1428b2',11 ).then(console.log)
)

return