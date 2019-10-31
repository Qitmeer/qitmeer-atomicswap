const bitcoin = require('bitcoinjs-lib')
const request = require('../helpers/request')
const BigNumber = require('bignumber.js')


// const BITPAY = `https://test-insight.bitpay.com/api`
// const BITPAY_MAIN = `https://insight.bitpay.com/api`
// const OMIN = 'https://api.omniexplorer.info'

const BITPAY = `http://otc.distoken.io/test-btc`
const BITPAY_MAIN = `http://otc.distoken.io/btc`

const EARN_COM = `http://otc.distoken.io/fees`

const BLOCKCYPHER_API = `https://api.blockcypher.com/v1/btc/main`
const BLOCKCYPHER_API_TESTNET = `https://api.blockcypher.com/v1/btc/test3`
const BLOCKCYPHER_API_TESTNET_TOKEN = 'cc995e0f046246b88e43f6443b2d6ae4'

const OMIN = 'http://otc.distoken.io/omni'

class Bitcoin {

  constructor(_network) {
      this.core = bitcoin
      this.net = bitcoin.networks[_network === 'mainnet' ? 'bitcoin' : 'testnet']
      this.network = _network
      this.root = this.network === 'testnet' ? BITPAY : BITPAY_MAIN
      this.rootcypher = this.network === 'testnet' ? BLOCKCYPHER_API_TESTNET : BLOCKCYPHER_API
  }

  calculateTxSize({ txIn, txOut = 2 } = {}) {
      const txSize = txIn > 0
      ? txIn * 146 + txOut * 33 + (15 + txIn - txOut)
      : 226 // default tx size for 1 txIn and 2 txOut
      return txSize
  }

  getFeersBySatoshis({ txIn = 1, txOut = 2, speed }) {
    return this.estimateFeeRate( speed )
      .then( fees => this.calculateTxSize({ txIn, txOut })*fees )
  }

  fetchUnspentsByTxs ( address, addrAmount, page = 0 ) {
    return request.get(`${this.root}/txs?address=${address}&pageNum=`+ page, {})
      .then( async ({pagesTotal, txs}) => {
        if ( pagesTotal <= page ) return false
        addrAmount = BigNumber(addrAmount)
        const unSends = []
        txs.map ( tx => {
          const {
            txid,
            vout
          } = tx
          vout.map( (out, i) => {
            const {
              value,
              spentTxId,
              scriptPubKey:{
                addresses:[addresses]
              }
            } = out
            if ( address === addresses && spentTxId === null && addrAmount.toNumber() > 0 ) {
              unSends.push({ txid, vout: i, amount:value })
              addrAmount = addrAmount.minus(value)
            } 
          })
        })
        if ( addrAmount.toNumber() > 0 ) {
          const u = await this.fetchUnspentsByTxs(address, addrAmount.toNumber(), ++page )
          if ( u === false ) return false
          unSends.push(...u)
        }
        return unSends
      })

  }

  fetchUnspents( address, addrAmount, {speed , txOut = 2} = {} ) {
      // 10 seconds cache
      // query requests
      return this.getBalance(address)
        .then( async ({utxo}) => {
          if ( utxo.length === 0 ) return false
          if ( addrAmount === undefined ) return {unSends:utxo}

          const feer = speed? await this.estimateFeeRate(speed) : false
          const unSends = []
          addrAmount = BigNumber(addrAmount)
          utxo = utxo.sort((a,b) => b.Amount -a.Amount )
          const len = utxo.length
          let feers = 0
          for ( let i = 0; i < len; i ++ ) {
            const v = utxo[i]
            unSends.push( v )
            
            feer ? 
            feers = BigNumber(feer)
              .multipliedBy(1e-8)
              .multipliedBy(this.calculateTxSize({ txIn: i+1, txOut }))
              .div(1024)
            :'';
            addrAmount = addrAmount.minus(v.Amount);
            if ( addrAmount.plus(feers).isLessThanOrEqualTo(0) ) break;
          }
          
          return addrAmount.plus(feers).isGreaterThan(0) ? undefined : ( feer ? {feers: feers.toNumber(),unSends}: {unSends} )
        })
        .catch(error => console.log(error))
  }

  estimateFeeRate( speed = 'fast' ) {
    return this.estimateFeeRateEARNCOM({speed})
  }

  estimateFeeRateEARNCOM({ speed } = {}) {
    const _speed = (() => {
      switch (speed) {
        case 'fast':    return 'fastestFee'
        case 'normal':  return 'halfHourFee'
        case 'slow':    return 'hourFee'
        default:      return 'halfHourFee'
      }
    })()

    // 10 minuts cache
    // query request
    return request
      .get(`${EARN_COM}`, {})
      .then(fees => Number(fees[_speed]) * 1024)
      .catch(error => console.log(error))
  }

  fetchTx(hash) {
    // 5 seconds cache
    // query request
    return request
      .get(`${this.rootcypher}/txs/${hash}`, {})
      .then( tx => {
        tx.fees = BigNumber(tx.fees).multipliedBy(1e8)
        return tx
      })
      .catch(error => {
        return {status:false, msg: 'BitPay: not have this txid '+hash }
      })
  }

  // fetchTxByBitPay(hash) {
  //   // 5 seconds cache
  //   // query request
  //   return request
  //     .get(`${this.root}/tx/${hash}`, {})
  //     .then(({ fees, ...rest }) => ({
  //       fees: BigNumber(fees).multipliedBy(1e8),
  //       ...rest,
  //     }))
  //     .catch(error => {
  //       debug('bitcoin')('BitPay: not have this txid '+hash)
  //       return {status:false, msg: 'BitPay: not have this txid '+hash }
  //     })
  // }

  fetchOmniBalance(address, assetId = 31) {
    return request.urlencoded(`${OMIN}/v1/address/addr/`, {
      addr: address,
    }).then( response => {
        const { error, balance } = response
        if (error) throw new Error(`Omni Balance: ${error}`)

        const findById = balance
          .filter(asset => parseInt(asset.id) === assetId || asset.id === assetId)
        if (!findById.length) {
          return 0
        }

        const usdsatoshis = BigNumber(findById[0].value)

        if (usdsatoshis) {
          return usdsatoshis.dividedBy(1e8).toNumber()
        } else {
          return 0
        }
      })
      .catch(error =>{
        console.log(error)
      })
  }

  fetchOmniUnspents( addr ) {
    return request.urlencoded(`${OMIN}/v1/address/addr/details/`,{addr})
  }

  balance ( address ) {
    return request.get(`${this.rootcypher}/addrs/${address}`,{unspentOnly:true}).then( data => {
      const {balance, txrefs = []} = data
      const utxo = txrefs.map ( v => ({ Index: v.tx_output_n, Amount: v.value, TxId: v.tx_hash }) )
      return { balance, utxo }
    })
  }
    
  sendTransactionTx( rawtx ) {
    return request.post(`${this.rootcypher}/txs/push`,{tx:rawtx, token: BLOCKCYPHER_API_TESTNET_TOKEN}).catch( e => e )
  }

}

module.exports = Bitcoin
module.exports.mainnet = () => new Bitcoin('mainnet')
module.exports.testnet = () => new Bitcoin('testnet')