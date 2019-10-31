//meer
// const _hostMeer = 'http://192.168.31.160:11360/api/v2/';

const qitmeerJs = require('qitmeer-js');
const request = require('../helpers/request');

const MEERURL = 'http://otc.distoken.io/meer'; //'https://api.kahf.io/api/v2';

const RPC = require('../helpers/qimeerRPC');

class Meer {

    constructor(_network = 'privnet') {
        this.core = qitmeerJs;
        this.net = qitmeerJs.networks[_network];
        if (this.net === undefined) throw `${_network} not qitmeer net`;
        this.network = _network;
        this.root = MEERURL;
        // this.meerRPC = meerRPC
    }

    faucet(addr, amount) {
        return request.get(`${this.root}/token/faucet`, { addr, amount }).then(e => {
            if (e.code !== 0) return [null, e];
            return [e.rs, null];
        });
    }

    meerSearch(condition) {
        return request.get(`${this.root}/record`, { condition }).then(e => {
            if (e.code !== 0) return [null, e];
            return [e.rs, null];
        });
    }

    balance(addr) {
        return request.get(`${this.root}/stats`, { addr }).then(e => {
            if (e.code !== 0) return [null, e];
            return [e.rs, null];
        });
    }

    fetchUnspents(addr) {
        // 10 seconds cache
        // query requests
        return request.get(`${this.root}/utxo`, { addr }).then(e => {
            if (e.code !== 0) return [null, e];
            const utxo = e.rs.map(v => ({
                Index: v.OutIndex,
                Amount: v.Amount,
                Txid: v.TxId
            }));
            return [utxo, null];
        });
    }

    async fetchTx(tx) {
        // query request
        const { data: { result } } = await request.get(`https://explorer.qitmeer.io/api/getTxDetail`, { tx });
        return result;
    }
    // records/tx
    sendTransactionTx(rawtx) {
        // return RPC.sendRawTransaction(rawtx)
        return request.post(`${this.root}/tx`, { rawtx });
    }
}

module.exports = Meer;
module.exports.mainnet = () => new Meer('mainnet');
module.exports.testnet = () => new Meer('testnet');
module.exports.privnet = () => new Meer('privnet');