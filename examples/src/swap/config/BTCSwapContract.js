const bitcoin = require('bitcoinjs-lib');
const randomBytes = require('randombytes');
const { timeToHex } = require('../helpers/union');

// creat OP map
const coderToOp = function () {
    const o = {};
    for (let i in bitcoin.opcodes) {
        o[bitcoin.opcodes[i]] = i;
    }
    return o;
}();

/**
 * Parsing the hex contract
 * @param {string} scriptHex 
 * @returns { string }
 */
function parsingBufferScrpit(scriptHex) {
    return bitcoin.script.decompile(Buffer(scriptHex, 'hex')).map(v => {
        if (typeof v === 'number') return coderToOp[v];
        if (v instanceof Buffer) return v.toString('hex');
    }).join(' ');
}

/**
 * Compile the hex contract
 * @param {string} scriptOp
 * @returns { hex }
 */
function compileBufferScrpit(scriptOp) {
    const arr = scriptOp.split(' ');
    return bitcoin.script.compile(arr.map(v => {
        if (bitcoin.opcodes[v]) return bitcoin.opcodes[v];else return Buffer(v, 'hex');
    })).toString('hex');
}

/**
 * Create time-lock contract script
 * @param secretHash 
 * @param _redeempublikeyHash Redeem publickey
 * @param _refundPublikeyHash refund publickey
 * @param lockTime 
 * @returns { Array }
 */
function lockTimeOpScript({ secretHash, _redeempublikeyHash, _refundPublikeyHash, lockTime }) {
    return ['OP_IF', 'OP_RIPEMD160', secretHash, 'OP_EQUALVERIFY', 'OP_DUP', 'OP_HASH160', _redeempublikeyHash, 'OP_ELSE', timeToHex(lockTime), 'OP_CHECKLOCKTIMEVERIFY', 'OP_DROP', 'OP_DUP', 'OP_HASH160', _refundPublikeyHash, 'OP_ENDIF', 'OP_EQUALVERIFY', 'OP_CHECKSIG'].join(' ');
}

/**
 * Create refund contract script
 * @param sign  refund Address sign
 * @param _refundPublikeyHash refund publickey
 * @param scriptHash
 * @returns { Array }
 */
function refundOpScript(sign, _refundPublikeyHash, scriptHash) {
    return [sign, _refundPublikeyHash, 'OP_0', scriptHash].join(' ');
}

/**
 * Create redeem contract script
 * @param sign  redeem Address sign
 * @param _redeemPublikeyHash redeem publickey hash
 * @param secret
 * @param scriptHash
 * @returns { Array }
 */
function redeemOpScript(sign, _redeemPublikeyHash, secret, scriptHash) {
    return [sign, _redeemPublikeyHash, secret, 'OP_1', scriptHash].join(' ');
}

/**
 * Create secretkey and secretKey ripemd160
 * @param sign  refund Address sign
 * @param _refundPublikeyHash refund publickey
 * @param scriptHash
 * @returns { Array }
 */

function creatSecretKey() {
    const secretKey = randomBytes(32);
    const secretKeyHash = bitcoin.crypto.ripemd160(secretKey);
    return {
        secret: secretKey.toString('hex'),
        secretHash: secretKeyHash.toString('hex')
    };
}

/**
 * Create the P2SH address through OPS
 * @param ops string
 * @param networkStr privnet|testnet|mainnet
 * @returns { p2shAddress: < Base58p2shAddress > , contractScript: < hex > }
 */
function creatP2SHAddress(ops, network) {
    const output = Buffer(compileBufferScrpit(ops), 'hex');
    const p2sh = bitcoin.payments.p2sh({ redeem: { output }, network });
    return {
        p2shAddress: p2sh.address,
        contractScript: output.toString('hex')
    };
}

module.exports = {
    creatSecretKey,
    redeemOpScript,
    lockTimeOpScript,
    refundOpScript,
    creatP2SHAddress,
    compileBufferScrpit,
    parsingBufferScrpit
};