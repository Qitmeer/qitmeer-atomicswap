// import BtcSwaps from '../../../../src/APP/swaps/BTC';
// import EthSwaps from '../../../../src/APP/swaps/ETH';
// import Erc20Swaps from '../../../../src/APP/swaps/ERC20';
// import MeerSwaps from '../../../../src/APP/swaps/MEER';

const BtcSwaps = require('../../swap/APP/swaps/BTC')
const EthSwapContrcat = require('../../swap/APP/swaps/ETH')
const Erc20Swaps = require('../../swap/APP/swaps/ERC20')
const MeerSwaps = require('../../swap/APP/swaps/MEER')
const abi = require('../../swap/config/ETHSwapABI')

const network = 'testnet'
const privates = '23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7'

const ethSwaps = new EthSwapContrcat({
    abi,
    contractAddress: '0x505c53c098A173C9da9aeFee7b7B1a0BF379064e',
    network
})
// ethSwaps.setSender(private)

const btcSwap = new BtcSwaps(network)

const meerSwaps = new MeerSwaps(network)

const abis = require('../../swap/config/ERC20SwapABI')
const tokenAbi = require('../../swap/config/ERC20')
const contractAddresse = '0x10280cF84828Cd5ca56CF8c757A56E9dc5e288FC'
const tokenAddress = '0x01E899e6Bc56aac01760e3aa092129cc0BEEC25F'

const ercSwaps = new Erc20Swaps({
  abi:abis,
  contractAddress:contractAddresse,
  tokenAbi, 
  tokenAddress,
  network,
  decimals: 8
})



// ethSwaps.setSender(private)
// btcSwap.setSender(private)
// meerSwaps.setSender(private)
// ercSwaps.setSender(private)
 
import {
    balancelist,
    setAccountLocal,
    getAccountLocal
} from './storage'

const coinList = {
    BTC: btcSwap,
    ETH: ethSwaps,
    HLC: ercSwaps,
    MEER: meerSwaps
}

function initPrivate( privates ) {
    for ( let key in coinList ) {
        coinList[key].setSender(privates)
    }
}

function clearPrivate(  ) {
    for ( let key in coinList ) {
        coinList[key].clearSender()
    }
}

function setAddress( privates ) {
    initPrivate( privates )
    const user = []
    for ( let key in coinList ) {
        user.push ( { coin: key, amount: '--', address: coinList[key].sender } )
        upDatePrice( key )
        // i++
    }
    balancelist.data.balances = user
}

function upDatePrice( key = 'MEER' ) {
    coinList[key][(key == 'MEER' || key === 'BTC')?'getBalance':'balanceOf']().then( b => {
        balancelist.data.balances.replace( o => o.coin == key , v => {
            const value = (key == 'MEER' || key === 'BTC')?b.balance: b
            v.amount = key === 'BTC'?value:coinList[key].getUnit(value)
            return v
        })
    })
}

function setUser( ) {
    const {name, privates } = getAccountLocal()
    balancelist.data.user = name
    setAddress( privates )
}


!function(){
    const user = getAccountLocal()
    if ( user && user.name ) setUser( )
}();


export {
    setUser,
    setAccountLocal,
    balancelist,
    coinList,
    getAccountLocal,
    upDatePrice
}