import dom, {Observable} from '../ZDom'

const balancelist = Observable()

balancelist.data('balances', [])
balancelist.data('orders', [])

const coinlist= ['BTC', 'USDT', 'ETH', 'ERC20', 'PMEER']

function setAccountLocal( name,  privates ) {
    localStorage.setItem('account', JSON.stringify({ name,  privates }))
}

function getAccountLocal() {
    return JSON.parse(localStorage.getItem('account'))
}

function addOrder({id, secret, secretHash, accept, num, script, type} = {}) {
    const order = getOrder()
    order.unshift({id, secret, secretHash, accept, num, script, type})
    balancelist.data.orders.addshift({id, secret, secretHash, num ,accept , script, type})
    localStorage.setItem('orders', JSON.stringify(order))
}

function getOrder( filer ) {
    const order = JSON.parse(localStorage.getItem('orders') || '[]')
    return filer? order.filter( filer ) :order
}

balancelist.data.orders = getOrder( )

export {
    balancelist,
    setAccountLocal,
    getAccountLocal,
    coinlist,
    addOrder,
    getOrder
}