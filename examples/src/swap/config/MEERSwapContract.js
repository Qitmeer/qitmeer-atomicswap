const { timeToHex } = require('../helpers/union');

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

module.exports = {
    redeemOpScript,
    lockTimeOpScript,
    refundOpScript
};