const { hexToTime } = require('../../helpers/union')
const BitcoinCore = require('../../interface/bitcoin')
const BtcContract = require('../../config/BTCSwapContract')
const BigNumber = require('bignumber.js')

let BTCPRIVATEKEY = Symbol('BTCprivateKey')

const UDST = 546

function BTCToSatoshis(num) {
    return BigNumber(num).multipliedBy(1e8)
}

function SatoshisToBTC(num) {
    return BigNumber(num).multipliedBy(1e-8)
}

const toPaddedHexString = (num, len) => {
    const str = num.toString(16)
    return "0".repeat(len - str.length) + str
}

class UsdtSwaps extends BitcoinCore {

    constructor( _network ) {
        super(_network)
    }

    setSender( privateKeyString ) {
        const network = this.net
        const bitcoin = this.core
        let keyPair
        try {
            keyPair = bitcoin.ECPair.fromWIF(privateKeyString, network)
        } catch (error) {
            keyPair = bitcoin.ECPair.makeRandom({network, rng: () => Buffer(privateKeyString, 'hex')})
        }
        this[BTCPRIVATEKEY] = keyPair
        return this
    }

    removeSender() {
        this[BTCPRIVATEKEY] = undefined
        return this
    }

    OMNISScript(amount, coin = 31) {
        const bitcoin = this.core
        const simple_send = [
            "6f6d6e69", // omni
            "0000",     // tx type
            "0000",     // version
            // "0000001f", // 31 for Tether
            toPaddedHexString(coin, 8),
            // "000000003B9ACA00" // amount = 10 * 100 000 000 in HEX
            toPaddedHexString(Math.floor(amount * 100000000), 16)
        ].join('')
    
        const data = Buffer.from(simple_send, "hex")
    
        const omniOutput = bitcoin.script.compile([
        bitcoin.opcodes.OP_RETURN,
        // payload for OMNI PROTOCOL:
        data
        ])
        return omniOutput
    }

    /**
     * @param {string} secretHash
     * @param {string} redeemAddress
     * @param {string} refundAddress
     * @param {number} lockTime
     * @returns {{scriptAddress: *, script: (*|{ignored})}}
     */
    creatSwaps( { redeemAddress, refundAddress, lockTime, secretHash } ) {
        const redeemPublicHash = this.core.address.fromBase58Check(redeemAddress)
        const refundPublicHash = this.core.address.fromBase58Check(refundAddress)
        lockTime = lockTime || new Date() / 1000 + 7200
        const swap = BtcContract.lockTimeOpScript({ 
            secretHash, 
            _redeempublikeyHash: redeemPublicHash.hash.toString('hex'), 
            _refundPublikeyHash: refundPublicHash.hash.toString('hex'), 
            lockTime 
        })
        return BtcContract.creatP2SHAddress( swap , this.net )
    }

    // 创建赎回合约
    /**
     *
     * @param {object} data
     * @param {string} data.recipientPublicKey
     * @param {number} data.lockTime
     * @returns {Promise.<string>}
     */
    async checkContract(contractScript) {
        const [, secretHash, redeemHash, lockTimeHex, refundHash, ] = BtcContract.parsingBufferScrpit(contractScript).match(/OP_IF OP_RIPEMD160 (.*) OP_EQUALVERIFY OP_DUP OP_HASH160 (.*) OP_ELSE (.*) OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 (.*) OP_ENDIF OP_EQUALVERIFY OP_CHECKSIG/);
        const redeemAddress = this.core.address.toBase58Check( Buffer(redeemHash, 'hex'), this.net.pubKeyHash )
        const refundAddress = this.core.address.toBase58Check( Buffer(refundHash, 'hex'), this.net.pubKeyHash )
        const lockTime = hexToTime(lockTimeHex)
        const scriptAddress = this.core.address.toBase58Check( this.core.crypto.hash160( Buffer(contractScript, 'hex') ), this.net.scriptHash)
        const {balance} = await this.fetchOmniBalance( scriptAddress );
        return {secretHash, refundAddress, lockTime, redeemAddress, scriptAddress, balance}
    }

    // 赎回合约
    /**
     * Create redeem contract script
     * @param {string} _wifPrivateKey refund Address PrivateKey
     * @param {string} _refundAddress refund publickey hash
     * @param {number} amount refund BTC num
     * @param {string} locktimeTxid time-lock contract transaction ID
     * @param {string} contractScript time-lock contract script
     * @param {number} lockTime Contract expiry date
     * @param {function} scriptSign
     * @returns { Transaction: string, RefundId: string }
     */
    creatContractRaw( { unspent, toAddress , amount, feer, contractScript, lockTime, scriptSign } ) {
        const bitcoin = this.core
        const network = this.net
        const txb = new bitcoin.TransactionBuilder(network)
        const keyPair = this[BTCPRIVATEKEY]

        lockTime?txb.setLockTime(lockTime):''
        
        unspent.map(({ txid, vout }, i) => {
            txb.addInput( txid, vout )
            lockTime?txb.__tx.ins[i].sequence = 0:''
        })

        txb.addOutput( toAddress, UDST);
        txb.addOutput( this.OMNISScript( amount ), 0 )

        const smallChange = BTCToSatoshis( totalNum.minus(feer) ).minus(UDST).toNumber()
        txb.addOutput( address,  smallChange )

        unspent.forEach((input, index) => {
            const signScript = txb.__tx.hashForSignature( index, Buffer(contractScript,'hex') , 1)
            const signature = keyPair.sign(signScript) 
            const transactionSign = bitcoin.script.signature.encode(signature, 1)
            const txscript = BtcContract.compileBufferScrpit( scriptSign( transactionSign ) )
            txb.__tx.ins[ index ].script = Buffer(txscript,'hex') 
        })
        return {
            Transaction: txb.__tx.toBuffer().toString('hex'),
            RefundId: txb.__tx.getId()
        }
    }

    async sginContractRaw( { toAddress , secret, contractScript, isRefund } ) {
        const { lockTime, scriptAddress, balance } = await this.checkContract(contractScript);
        if ( balance === 0 ) throw `${scriptAddress} balance 0`
        const unspent = await this.fetchUnspents ( scriptAddress )
        if ( unspent === false ) throw  `${scriptAddress} balance low`
        const feer = await this.getFeersBySatoshis({ txIn: unspent.length, txOut: 3 })

        const keyPair = this[BTCPRIVATEKEY]
        const publickey = keyPair.publicKey.toString('hex')

        const scriptSign = signBuffer => {
            const sign = signBuffer.toString('hex')
            if ( isRefund === true ) {
                return BtcContract.refundOpScript( sign, publickey, contractScript )
            } else if ( secret !== undefined ) {
                return BtcContract.redeemOpScript( sign.toString('hex'), publickey, secret, contractScript )
            } else {
                throw 'isRefund ture or secret need have'
            }
        }

        return this.creatContractRaw({ keyPair, toAddress , amount: balance, feer, contractScript, lockTime: isRefund === true? lockTime: undefined, scriptSign })
    }

    redeemRaw( { toAddress , contractScript, secret } ) {
        return this.sginContractRaw({ toAddress , secret, contractScript })
    }

    refundRaw( { toAddress , contractScript } ) {
        return this.sginContractRaw({ toAddress , contractScript, isRefund:true })
    }
    
    /**
     * @param {object} to
     * @param {string} to.address
     * @param {string} to.amount
     * @returns {promise}
     */
    async sendOMNI({ to, speed = 'fast', lockTime } = {}) {
        const bitcoin = this.core
        const network = this.net
        const keyPair = this[BTCPRIVATEKEY]
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })

        const usdtBanlance = await this.fetchOmniBalance( address, 31)
        if ( usdtBanlance < to.amount ) throw `${address} balance low`
        
        const {unSends} = await this.fetchUnspents( address ) 
        if ( unSends === undefined ) throw '${address} utxo low'

        const txb = new bitcoin.TransactionBuilder( network )
        lockTime?txb.setLockTime(lockTime):''
        let totalNum = BigNumber(0)
        
        unSends.map(({ txid, vout, amount }, i) => {
            txb.addInput( txid, vout )
            lockTime?txb.__tx.ins[i].sequence = 0:''
            totalNum = totalNum.plus(amount)
        })
        
        const feer = await this.estimateFeeRate(speed)
        const feers = BigNumber(feer)
            .multipliedBy(1e-8)
            .multipliedBy(this.calculateTxSize({ txIn: unSends.length, txOut:3 }))
            .div(1024)

        txb.addOutput( to.address, UDST )
        txb.addOutput( this.OMNISScript(to.amount), 0 )

        const smallChange = BTCToSatoshis( totalNum.minus(feers) ).minus(UDST).toNumber()
        txb.addOutput( address,  smallChange )

        unSends.map((input, index) => {
            txb.sign(index, keyPair)
        })
        const raw = txb.build().toHex()
        return this.sendTransactionTx(raw)
    }
}

module.exports = UsdtSwaps