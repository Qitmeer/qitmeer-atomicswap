const bitcoin = require('bitcoinjs-lib')

const InputDataDecoder = require('ethereum-input-data-decoder')
const Ethereum = require('../../interface/ethereum')

const BigNumber = require('bignumber.js')

let ETHPRIVATEKEY = Symbol('EthprivateKey')

class ERC20 {

  constructor({ tokenAbi, tokenAddress, network, decimals }) {
    if ( tokenAbi === undefined ) {
      throw new Error('EthSwap: tokenAbi required')
    }
    if ( tokenAddress === undefined ) {
      throw new Error('EthSwap: "tokenAddress" required')
    }
    const { web3, Contract } = Ethereum[network]()
    this.web3 = web3
    this.createContract = Contract
    this.ERC20Address = tokenAddress
    this.ERC20 = Contract( tokenAbi, tokenAddress )
    this._decimals = decimals
  }

  setSender( privateKeyString ) {
    privateKeyString = ('0x' == privateKeyString.substr(0, 2)?'':'0x') + privateKeyString
    const { address, privateKey } = this.web3.eth.accounts.privateKeyToAccount(privateKeyString)
    this[ETHPRIVATEKEY] = privateKey
    this.sender = address
    return this
  }

  symbol() {
    return this.ERC20.methods.name().call( this.sender )
  }

  decimals() {
    if ( this._decimals !== undefined ) return this._decimals
    return this.ERC20.methods.decimals().call( this.sender )
      .then( decimals => {
        this._decimals =  decimals
        return decimals
      })
  }

  numToBigNum( amount ) {
    const decimals = this._decimals
    const exp = BigNumber(10).pow(decimals)
    return BigNumber(amount).times(exp)
  }

  transfer( toAddress, amount ) {
    amount = this.numToBigNum( amount ).toString()
    return this.ERC20.methods.transfer( toAddress, amount ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  approve( _spender, amount ) {
    amount = this.numToBigNum( amount ).toString()
    return this.ERC20.methods.approve( _spender, amount ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  allowance( _owner, _spender ) {
    return this.ERC20.methods.allowance(  _owner, _spender ).call( this.sender )
  }

  balanceOf( address = this.sender ) {
    return this.ERC20.methods.balanceOf( address ).call( this.sender )
  }
}

class ERC20Swap extends ERC20 {

  constructor({ network = 'testnet', abi, contractAddress, tokenAbi, tokenAddress, decimals } = {}) {
    if ( abi === undefined ) {
      throw new Error('EthSwap: abi required')
    }
    if ( contractAddress === undefined ) {
      throw new Error('EthSwap: "contractAddress" required')
    }
    if ( tokenAbi === undefined ) {
      throw new Error('EthSwap: tokenAbi required')
    }
    if ( tokenAddress === undefined ) {
      throw new Error('EthSwap: "tokenAddress" required')
    }
    super({ tokenAbi, tokenAddress, network, decimals })
    this.contract = this.createContract( abi, contractAddress )
    this.contractAddress = contractAddress
    this.decoder  = new InputDataDecoder(abi)
  }

  setSender( privateKeyString ) {
    privateKeyString = ('0x' == privateKeyString.substr(0, 2)?'':'0x') + privateKeyString
    const { address, privateKey } = this.web3.eth.accounts.privateKeyToAccount(privateKeyString.toLocaleLowerCase())
    this[ETHPRIVATEKEY] = privateKey
    this.sender = address
    return this
  }

  approveSwap( amount ) {
    return  this.approve( this.contractAddress, amount )
  }

  checkAllowance () {
    return this.allowance( this.sender, this.contractAddress )
  }

  getBalance( ownerAddress = this.sender ) {
    return this.contract.methods.getBalance( ownerAddress ).call( this.sender )
  }

  async createSwap ({redeemAddress , amount, secretHash} = {}) {
    const [ tokenBalance, allowance ] = await Promise.all([
      this.balanceOf(),
      this.checkAllowance()
    ])
    amount = this.numToBigNum( amount )
    if ( amount.isGreaterThan( tokenBalance ) ) {
      throw new Error(this.sender + 'address balance '+ tokenBalance +' is low')
    }

    if ( amount.isGreaterThan( allowance ) ) {
      throw new Error( this.sender + 'address allowance '+ allowance +' is low')
    }
    secretHash = ('0x' == secretHash.substr(0, 2)?'':'0x') + secretHash
    return this.contract.methods.createSwap( secretHash, redeemAddress.toLocaleLowerCase(), amount.toString(), this.ERC20Address ).send( this.sender, this[ETHPRIVATEKEY] )
  }

  getUnit( num ) {
    return BigNumber(num).div(1e8).toNumber()
  }

  getSecret( redeemAddress ) { 
    return this.contract.methods.getSecret( redeemAddress ).call( this.sender )
  }
  
  checkContract( redeemAddress, ownerAddress = this.sender ) {
    return this.contract.methods.swaps( ownerAddress , redeemAddress )
      .call( this.sender )
      .then(({ targetWallet, secret, secretHash, createdAt, balance, token }) => {
        if ( targetWallet.toLocaleLowerCase() !== redeemAddress.toLocaleLowerCase() ) return false
        return { token, redeemAddress, ownerAddress, secret, secretHash, createdAt, balance }
      })
  }

  async refund( redeemAddress ) {
    const {createdAt, balance } = await this.checkContract(redeemAddress)
    // console.log( this.sender ,createdAt, balance, typeof createdAt, balance)
    if ( balance === '0' || createdAt*1000 + 86400 > new Date()*1 ) return false
    return this.contract.methods.refund( redeemAddress ).send( this.sender, this[ETHPRIVATEKEY] )
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

module.exports = ERC20Swap
