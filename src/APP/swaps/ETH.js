const bitcoin = require('bitcoinjs-lib')

const InputDataDecoder = require('ethereum-input-data-decoder')
const Ethereum = require('../../interface/ethereum')

let ETHPRIVATEKEY = Symbol('EthprivateKey')

class EthSwap {

  constructor({ network = 'testnet', abi, contractAddress } = {}) {
    if ( abi === undefined ) {
      throw new Error('EthSwap: abi required')
    }
    if ( contractAddress === undefined ) {
      throw new Error('EthSwap: "contractAddress" required')
    }
    const { web3, Contract } = Ethereum[network]()
    this.web3 = web3
    this.contract = Contract( abi, contractAddress )
    this.decoder  = new InputDataDecoder(abi)
  }

  setSender( privateKeyString ) {
    privateKeyString = ('0x' == privateKeyString.substr(0, 2)?'':'0x') + privateKeyString
    const { address, privateKey } = this.web3.eth.accounts.privateKeyToAccount(privateKeyString.toLocaleLowerCase())
    this[ETHPRIVATEKEY] = privateKey
    this.sender = address
    return this
  }

  balanceOf( address = this.sender ) {
    return this.web3.eth.getBalance(address)
  }

  getUnit( num ) {
    return this.web3.utils.fromWei(num)
  }

  getBalance( ownerAddress = this.sender ) {
    return this.contract.methods.getBalance( ownerAddress ).call( this.sender )
  }

  getSecret( redeemAddress ) { 
    return this.contract.methods.getSecret( redeemAddress ).call( this.sender )
  }
  
  checkContract( redeemAddress, ownerAddress = this.sender ) {
    return this.contract.methods.swaps( ownerAddress , redeemAddress )
      .call( this.sender )
      .then(({targetWallet, secret, secretHash, createdAt, balance}) => {
        if ( targetWallet !== redeemAddress ) return false
        return { redeemAddress, ownerAddress, secret, secretHash, createdAt, balance }
      })
  }

  async refund( redeemAddress ) {
    const {createdAt, balance } = await this.checkContract(redeemAddress)
    // console.log( this.sender ,createdAt, balance, typeof createdAt, balance)
    if ( balance === '0' || createdAt*1000 + 86400 > new Date()*1 ) return false
    return this.contract.methods.refund( redeemAddress ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  async createSwap ({redeemAddress , amount, secretHash} = {}) {
    const balance = await this.web3.eth.getBalance(this.sender)
    amount = this.web3.utils.toWei( amount+'', 'ether')
    if ( amount >= balance ) return false
    secretHash = ('0x' == secretHash.substr(0, 2)?'':'0x') + secretHash
    return this.contract.methods.createSwap( secretHash, redeemAddress.toLocaleLowerCase() ).value( amount ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  async redeem( secret, ownerAddress ) {
    const { balance, secretHash } = await this.checkContract(this.sender, ownerAddress)
    if ( balance === '0' ) return false
    secret = ('0x' == secret.substr(0, 2)?'':'0x') + secret
    const checkHash = bitcoin.crypto.ripemd160( Buffer.from(secret.substr(2), 'hex') ).toString('hex')
    if ( secretHash !== '0x' + checkHash ) return false
    return this.contract.methods.withdraw( secret, ownerAddress ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  /**
   *
   * @param {string} transactionHash
   * @returns {Promise<any>}
   */
  getSecretFromTxhash(transactionHash) {
    return this.web3.eth.getTransaction(transactionHash)
      .then(txResult => {
      try {
        const bytes32 = this.decoder.decodeData(txResult.input)
        return this.web3.utils.bytesToHex(bytes32.inputs[0]).split('0x')[1]
      } catch (err) {
        console.log('Trying to fetch secret from tx: ' + err.message)
        return
      }
    })
  }
    
  
}

module.exports = EthSwap
  