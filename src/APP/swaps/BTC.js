const { hexToTime } = require('../../helpers/union')
const BitcoinCore = require('../../interface/bitcoin')
const BtcContract = require('../../config/BTCSwapContract')
const BigNumber = require('bignumber.js')

function BTCToSatoshis(num) {
    return BigNumber(num).multipliedBy(1e8)
}

function SatoshisToBTC(num) {
    return BigNumber(num).multipliedBy(1e-8)
}

let BTCPRIVATEKEY = Symbol('bTCprivateKey')

class BtcSwaps extends BitcoinCore {

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
        this.sender = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network }).address
        return this
    }

    clearSender() {
        this[BTCPRIVATEKEY] = undefined
        this.sender = undefined
        return this
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
        lockTime = lockTime || ( new Date() / 1000 + 7200 )
        const swap = BtcContract.lockTimeOpScript({ 
            secretHash, 
            _redeempublikeyHash: redeemPublicHash.hash.toString('hex'), 
            _refundPublikeyHash: refundPublicHash.hash.toString('hex'), 
            lockTime 
        })
        return BtcContract.creatP2SHAddress( swap , this.net )
    }

    // 检查时间锁合约
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
        const {balance} = await this.getBalance( scriptAddress );
        return {secretHash, refundAddress, lockTime, redeemAddress, scriptAddress, balance}
    }

    // 赎回合约
    /**
     * Create redeem contract script
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
        unspent.map(({  TxId, Index }, i) => {
            txb.addInput(  TxId, Index )
            lockTime?txb.__tx.ins[i].sequence = 0:''
        })
        txb.addOutput( toAddress, BTCToSatoshis( amount ).minus( feer ).toNumber() );
        txb.inputs.forEach((input, index) => {
            const signScript = txb.__tx.hashForSignature( index, Buffer.from(contractScript,'hex') , 1)
            const signature = keyPair.sign(signScript) 
            const transactionSign = bitcoin.script.signature.encode(signature, 1)
            const txscript = BtcContract.compileBufferScrpit( scriptSign( transactionSign ) )
            txb.__tx.ins[ index ].script = Buffer.from(txscript,'hex') 
        })

        return this.sendTransactionTx(txb.__tx.toBuffer().toString('hex'))
        // return {
        //     Transaction: txb.__tx.toBuffer().toString('hex'),
        //     RefundId: txb.__tx.getId()
        // }
    }

    async sginContractRaw( { toAddress , secret, contractScript, isRefund } ) {
        const { lockTime, scriptAddress, balance } = await this.checkContract(contractScript);
        if ( balance === 0 ) throw `${scriptAddress} balance 0`
        const unspent = await this.fetchUnspents ( scriptAddress, balance )
        if ( unspent === false ) throw  `${scriptAddress} balance low`
        const feer = await this.getFeersBySatoshis({ txIn: unspent.unSends.length, txOut: 1 })
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
        return this.creatContractRaw({ unspent: unspent.unSends, keyPair, toAddress , amount: balance, feer, contractScript, lockTime: isRefund === true? lockTime: undefined, scriptSign })
    }

    redeemRaw( { toAddress , contractScript, secret } ) {
        return this.sginContractRaw({ toAddress , secret, contractScript })
    }

    refundRaw( { toAddress , contractScript } ) {
        return this.sginContractRaw({ toAddress , contractScript, isRefund:true })
    }

    // sendTo(  )

    async sendBtc({ to, speed = 'fast', lockTime } = {}) {
        const bitcoin = this.core
        const network = this.net
        const keyPair = this[BTCPRIVATEKEY]
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
        const amount = to.reduce((p, {amount}) => p.plus(amount), BigNumber(0))
        const {feers,unSends} = await this.fetchUnspents ( address, amount.toNumber(), { speed , txOut: to.length + 1 })  /* 找零 */
        if ( unSends === false ) throw  `${address} balance low`
        const txb = new bitcoin.TransactionBuilder(network)
        lockTime?txb.setLockTime(lockTime):''
        let totalNum = BigNumber(0)
        unSends.map(({ TxId, Index, Amount }, i) => {
            txb.addInput( TxId, Index )
            lockTime?txb.__tx.ins[i].sequence = 0:''
            totalNum = totalNum.plus(Amount)
        })
        to.map ( ({ address, amount }) => {
            txb.addOutput( address, BTCToSatoshis( amount ).toNumber() )
        })
        const smallChange = totalNum.minus(BTCToSatoshis(amount)).minus(BTCToSatoshis(feers))
        if ( smallChange.isGreaterThan(0) ) txb.addOutput( address, smallChange.toNumber())
        unSends.map((input, index) => {
            txb.sign(index, keyPair)
        })
        const raw = txb.build().toHex()
        return this.sendTransactionTx(raw)
    }

    getBalance( addr = this.sender ) {
        return this.balance(addr)
            .then( e => {
                e.balance = SatoshisToBTC(e.balance).toNumber()
                return e
            })
    }
}

module.exports = BtcSwaps

