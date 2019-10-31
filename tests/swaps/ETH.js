const EthSwapContrcat = require('../../src/APP/swaps/ETH')
const abi = require('../../src/config/ETHSwapABI')

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
 *  contractAddress 0x505c53c098A173C9da9aeFee7b7B1a0BF379064e
 */

!async function() {

  /**
   * creat Instance
   */

  const EthSwaps = new EthSwapContrcat({
    abi,
    contractAddress: '0x505c53c098A173C9da9aeFee7b7B1a0BF379064e',
    network: 'testnet'
  })

  EthSwaps.getSecretFromTxhash( '0x0240b01acc94227af0a77577a0c1e395555b933d5a0110aaf9c9b5a3b112bb8f:' )
  .then( secret => console.log ( `secret ${secret}` ))
 
 return
 
  // alice
  EthSwaps.setSender('23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7')

  // const aliceBlalance = await EthSwaps.web3.eth.getBalance(EthSwaps.sender)
  // console.log ( `alice balance ${aliceBlalance}` )

  // // const consract = await EthSwaps.createSwap({
  // //   redeemAddress : '0xffb409b7b198993cc946ba6d7874676f8FD07188', 
  // //   amount: 0.1, 
  // //   secretHash: '76ca8525763881278982698e025f7bb26b838609'
  // // })
  // // console.log ( `consract ${consract}` ) // 0xc8bf1d9e10e0ec2d065a16e09d94216b56ce470911c7019b48ecf761acb4110c

  // // bob
  EthSwaps.setSender('30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee')
  const bobSwapsBalance = await EthSwaps.getBalance('0xB95fB08257DAa1F4d6458a72A95726246f7CCdD1')
  console.log ( `bob balance of alice ${bobSwapsBalance}` )

  // // bob redeem eth
  // // const redeemTxHash = await EthSwaps.redeem( 'ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75', '0xB95fB08257DAa1F4d6458a72A95726246f7CCdD1' )
  // // console.log ( `bob redeem ${redeemTxHash}` ) // 0x1c2e75395746a56ca46184c83ee1300b6af5597c0ab77a37f144fdfd1348435d

  // // bob
  // const bobBlalance = await EthSwaps.web3.eth.getBalance(EthSwaps.sender)
  // console.log ( `bob balance ${bobBlalance}` )

  // get secret
  console.log ( `secret ${1}` )
  const secret = await EthSwaps.getSecretFromTxhash( '0x1c793c9f18fa9d01039686d3ef2c572a7ea4e495166d48bc7c1a102224d8c5be' )
  console.log ( `secret ${secret}` )
}();