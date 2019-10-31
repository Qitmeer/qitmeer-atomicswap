import {coinList} from './coin'
import {getOrder,addOrder} from './storage'

const bob = '0xffb409b7b198993cc946ba6d7874676f8FD07188'

async function AliceBuyMeerByEth( num ) {
    const { secret, secretHash } = coinList.MEER.creatSecretKey()
    const consract = await coinList.ETH.createSwap({
        redeemAddress : bob, 
        amount: num, 
        secretHash: secretHash
    })
    addOrder({
        type: 'Lock ETH',
        id: consract,
        secret, 
        secretHash, 
        accept: bob,
        num
    })
}

async function FefundETH( redeemAddress ) {
    return coinList.ETH.refund(redeemAddress)
}

async function AliceBuyEthByMeer( num, secretHashs, toAddress ) {
    const { secret, secretHash } = secretHashs? {secret:'',secretHash:secretHashs} : coinList.MEER.creatSecretKey();
    const bob = toAddress || 'TmeRp1j28asEALtNEbKcDVqZM9AYUeJ3DAn'
    const swapsContract = coinList.MEER.creatSwaps({
        redeemAddress: bob,
        refundAddress: coinList.MEER.sender,
        secretHash 
    })
    const ds = await coinList.MEER.sendMeer({to:[
        {address: swapsContract.p2shAddress, amount: num}
    ]})
    addOrder({
        type: 'Lock MEER',
        id: swapsContract.p2shAddress,
        secret, 
        secretHash, 
        accept: bob,
        script: swapsContract.contractScript.toString('hex'),
        num
    })
}

async function redeemMeerByUser( secret,  contractScript ) {
    const scriptHxe = await coinList.MEER.redeemRaw( { 
        toAddress:  coinList.MEER.sender, 
        contractScript: Buffer.from ( contractScript+'', 'hex'), 
        secret : secret+''
    })

    addOrder({
        type: 'Redeem MEER',
        id: scriptHxe.rs,
        script: contractScript+'',
        secret : secret+''
        
    })
}

async function redeemEthByUser( secret,  owener ) {
    const redeemTxHash = await coinList.ETH.redeem( secret+'', owener+'' )
    addOrder({
        type: 'Redeem ETH',
        
        id: redeemTxHash
    })
}


async function getSecretByTxId ( txid, coin = 'MEER' ) {
    return coinList[coin].getSecretFromTxhash(txid)
}


export {
    AliceBuyMeerByEth,
    FefundETH,
    AliceBuyEthByMeer,
    redeemMeerByUser,
    redeemEthByUser,
    getSecretByTxId
}