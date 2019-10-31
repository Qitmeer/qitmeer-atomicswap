const MEERSwapContract = require('../../config/MEERSwapContract')
const { hexToTime } = require('../../helpers/union')
const randomBytes = require('randombytes')
const MeerCore = require('../../interface/qitmeerKahf')
const BigNumber = require('bignumber.js')

function MeerToQit(num) {
    return BigNumber(num).multipliedBy(1e8)
}

function QitToMeer(num) {
    return BigNumber(num).multipliedBy(1e-8)
}

let MEERPRIVATEKEY = Symbol('MeerPrivateKey')

class MeerSwaps extends MeerCore {

    constructor( _network ) {
        super(_network)
        this.safeTime = 3600
    }

    setSender( privateKeyString ) {
        const qitmeer = this.core
        let keyPair
        try {
            keyPair = qitmeer.ec.fromWIF( privateKeyString )
        } catch (error) {
            keyPair = qitmeer.ec.fromPrivateKey( Buffer.from( privateKeyString, 'hex' ) )
        }
        this[MEERPRIVATEKEY] = keyPair
        this.sender = this.privateKeyToP2PKH( keyPair.privateKey )
        return this
    }

    clearSender() {
        this[MEERPRIVATEKEY] = undefined
        this.sender = undefined
        return this
    }

    getUnit( num ) {
        return BigNumber(num).div(1e8).toNumber()
    }

    faucetMeer( {address = this.sender, amount = 1} = {} ) {
        return this.faucet( address, amount )
    }

    async getBalance( address = this.sender ) {

        if ( address === undefined ) throw 'address must not undefind'

        const [
            [{balance}],
            [utxo]
        ] = await Promise.all([
            this.balance(address),
            this.fetchUnspents(address)
        ])

        if ( balance === null || utxo === null ) throw 'getBalance error'
        return { 
            balance: MeerToQit(balance).toNumber(),
            utxo
        }
    }

    creatSecretKey( ) {
        const secretKey = randomBytes(32)
        const secretKeyHash = this.core.hash.ripemd160(secretKey);
        return {
            secret: secretKey.toString('hex'),
            secretHash: secretKeyHash.toString('hex')
        }
    }

    privateKeyToP2PKH ( privateKeyBuffer ) {
        const qitmeerJs = this.core
        const network = this.net
        const keyPair = qitmeerJs.ec.fromPrivateKey( privateKeyBuffer )
        const hash160 = qitmeerJs.hash.hash160(keyPair.publicKey)
        const p2pkhAddress = qitmeerJs.address.toBase58Check(hash160, network.pubKeyHashAddrId)
        return p2pkhAddress
    }


    /**
     * Create the P2SH address through OPS
     * @param {string} opStr
     * @returns { p2shAddress: < Base58p2shAddress > , contractScript: < hex > }
     */
    creatP2SHAddress( opStr ) {
        const qitmeerJs = this.core
        const network = this.net
        const contractScript = qitmeerJs.script.fromAsm(opStr).toBuffer()
        const hash160 = qitmeerJs.hash.hash160(contractScript)
        const p2shAddress = qitmeerJs.address.toBase58Check(hash160, network.ScriptHashAddrID )
        return {
            p2shAddress,
            contractScript: contractScript
        }
    }

    /**
     * Parsing the hex contract
     * @param scriptHex buffer hex 
     * @returns { buffer }
     */
    parsingBufferScrpit( scriptHex ) {
        return this.core.script.fromBuffer( scriptHex ).toAsm();
    }

    compileBufferScrpit( opStr ) {
       return this.core.script.fromAsm(opStr).toBuffer()
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
        lockTime = lockTime || (( new Date() / 1000 )|0) + this.safeTime 
        const swap = MEERSwapContract.lockTimeOpScript({ 
            secretHash, 
            _redeempublikeyHash: redeemPublicHash.hash.toString('hex'), 
            _refundPublikeyHash: refundPublicHash.hash.toString('hex'), 
            lockTime 
        })
        return this.creatP2SHAddress( swap )
    }

    checkContract( contractScriptBuffer ) {
        const [, secretHash, redeemHash, lockTimeHex, refundHash, ] = this.parsingBufferScrpit( contractScriptBuffer ).match(/OP_IF OP_RIPEMD160 (.*) OP_EQUALVERIFY OP_DUP OP_HASH160 (.*) OP_ELSE (.*) OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 (.*) OP_ENDIF OP_EQUALVERIFY OP_CHECKSIG/);
        const redeemAddress = this.core.address.toBase58Check( Buffer.from(redeemHash, 'hex'), this.net.pubKeyHashAddrId )
        const refundAddress = this.core.address.toBase58Check( Buffer.from(refundHash, 'hex'), this.net.pubKeyHashAddrId )
        const lockTime = hexToTime(lockTimeHex)
        const scriptAddress = this.core.address.toBase58Check( this.core.hash.hash160( contractScriptBuffer ), this.net.ScriptHashAddrID )
        return { secretHash, refundAddress, lockTime, redeemAddress, scriptAddress }
    }

    /**
     * Create redeem contract script
     * @param {string} _refundAddress refund publickey hash
     * @param {number} amount refund BTC num
     * @param {string} locktimeTxid time-lock contract transaction ID
     * @param {buffer} contractScript time-lock contract script
     * @param {number} lockTime Contract expiry date
     * @param {function} scriptSign
     * @returns { Transaction: string, RefundId: string }
     */
    creatContractRaw( { utxo, toAddress , seed = 'fast', contractScript, lockTime, scriptSign } ) {
        const qitmeerJs = this.core
        const txb = qitmeerJs.txsign.newSigner( this.net );
        const keyPair = this[MEERPRIVATEKEY]
        if (lockTime > 0) {
            txb.setLockTime(lockTime)
        }
        let amountAll = BigNumber(0)
        utxo.map( v => {
            const {Txid, Index, Amount} = v
            const inScript = {
                prevOutScript: qitmeerJs.script.fromBuffer( contractScript )
            }
            if( lockTime > 0 ) inScript.sequence = 0
            amountAll = amountAll.plus(Amount)
            txb.addInput( Txid, Index ,inScript);
        })
        
        txb.addOutput( toAddress, amountAll.minus(this.getFee(txb, seed)).toNumber());
        utxo.map( (v,i) => {
            txb.sign(i, keyPair);
            const transactionSign = txb.__inputs[i].signature.toString('hex');
            // console.log (
            //     scriptSign( transactionSign )
            // )
            txb.__tx.vin[i].script = qitmeerJs.script.fromAsm( scriptSign( transactionSign ) ).toBuffer()
        })
        
        const newTransaction = txb.__tx.clone();
        return this.sendTransactionTx( newTransaction.toBuffer().toString('hex') )
    }

    getFee( tx, speed = 'fast' ) {
        const size = tx.__tx.byteLength()
        const s = {
            fast: 2,
            normal: 1,
            slow: 0.6
        }
        return BigNumber( size ).div(2).multipliedBy(5000).multipliedBy(s[speed])
    }

    async sendMeer({ to, speed = 'fast', lockTime } = {}) {
        const qitmeer = this.core
        const network = this.net
        const keyPair = this[MEERPRIVATEKEY]
        const unspent = await this.getBalance()
        const tx = qitmeer.txsign.newSigner( network );
        let amountAll = 0
        lockTime?tx.setLockTime(lockTime):''
        to.map( v => {
            amountAll = MeerToQit( v.amount ).plus(amountAll)
            tx.addOutput( v.address, MeerToQit( v.amount ).toNumber() )
        })
        
        if (  amountAll.isGreaterThanOrEqualTo(unspent.balance) ) throw `${this.sender} balance ${unspent.balance} is low`;

        const len = unspent.utxo.length
        for( let i = 0; i < len; i ++ ) {
            const { Txid, Index, Amount } = unspent.utxo[i]
            tx.addInput( Txid, Index )
            amountAll = amountAll.minus( Amount )
            const fee = this.getFee( tx, speed )
            if ( amountAll.plus(fee).isLessThanOrEqualTo(0) ) break;
        }

        const fee = this.getFee( tx, speed )
        amountAll = amountAll.plus(fee)

        if ( amountAll.isGreaterThan(0) ) throw `${this.sender} balance ${unspent.balance} is low, this transactoin also need ${amountAll.toNumber()} qit`;
        
        tx.addOutput( this.sender, amountAll.abs().toNumber() )
        tx.__inputs.forEach( (v,i) =>{ 
            tx.sign( i, keyPair  )
        }) 
        
        return this.sendTransactionTx( tx.build().toBuffer().toString('hex') )
    }

    async sginContractRaw( { toAddress , secret, contractScript, isRefund } ) {
        const { lockTime, scriptAddress } = this.checkContract(contractScript);
        const unspent = await this.getBalance ( scriptAddress )
        if ( unspent.balance === 0 ) throw `${scriptAddress} balance 0`
        const keyPair = this[MEERPRIVATEKEY]
        const publickey = keyPair.publicKey.toString('hex')
        const scriptSign = signBuffer => {
            const sign = signBuffer.toString('hex')
            if ( isRefund === true ) {
                return MEERSwapContract.refundOpScript( sign, publickey, contractScript.toString('hex') )
            } else if ( secret !== undefined ) {
                return MEERSwapContract.redeemOpScript( sign.toString('hex'), publickey, secret, contractScript.toString('hex') )
            } else {
                throw 'isRefund ture or secret need have'
            }
        }
        return this.creatContractRaw({ utxo: unspent.utxo, keyPair, toAddress , contractScript, lockTime: isRefund === true? lockTime: undefined, scriptSign })
    }

    redeemRaw( { toAddress , contractScript, secret } ) {
        return this.sginContractRaw({ toAddress , secret, contractScript })
    }

    refundRaw( { toAddress , contractScript } ) {
        return this.sginContractRaw({ toAddress , contractScript, isRefund:true })
    }

    async getSecretFromTxhash( TxHash ) {
        const tx = await this.fetchTx(TxHash)
        return tx.vin[0].scriptSig? tx.vin[0].scriptSig.asm.split(' ')[2]: undefined
    }
}

module.exports = MeerSwaps


