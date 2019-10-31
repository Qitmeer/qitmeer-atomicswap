const UsdtSwap = require('../../src/APP/swaps/USDT')

const usdtSwap = new UsdtSwap('mainnet')
console.log(
    usdtSwap.OMNISScript(10).toString('hex')
)

// usdtSwap.fetchOmniUnspents('16Jrv27bcNa9MuZbd4AkTrm5QkSW4MrY7G').then(console.log)
// usdtSwap.fetchUnspents('16Jrv27bcNa9MuZbd4AkTrm5QkSW4MrY7G').then(console.log)

usdtSwap.setSender('< wif >')

usdtSwap.sendOMNI( { 
    to: {
        address: '1Pa7y4LKPZ75ujvi8cj9jSQoggggPmUB4y',
        amount: 10
    }
} ).then(console.log)