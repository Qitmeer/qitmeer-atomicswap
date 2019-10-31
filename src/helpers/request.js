const axios = require('axios')
const Qs = require('qs')
axios.defaults.timeout =  50000;


function Requst(url, prame, method, headers = {}) {
    if ( method === 'DELETE') {
        return axios.delete(
            url, 
            {
                data: prame,
                headers:{
                    'Content-Type':'application/json;charset=UTF-8'
                }
            }
        ).then( e => e.data ).catch( err => {
            console.log(err)
            console.log(err.config.url,'---链接超时---')
            return err
        })
    } 
    const axi = { method }
    if ( method === 'get' ) {
        prame = Qs.stringify( prame )
        axi.url = url +( prame === ''?'':'?'+prame )
    } else if ( method === 'post' ) {
        axi.url = url
        if ( headers['Content-Type'] === 'application/x-www-form-urlencoded' ) {
            axi.data = Qs.stringify( prame )
        } else {
            axi.data = prame
            headers['Content-Type'] = 'application/json'
        }
    }
    axi.headers = headers
    return axios(axi).then( e => e.data )
}

function get(url, prame , headers) {
    return Requst( url, prame, 'get', headers )
}

function post(url, prame, headers) {
    return Requst(url, prame, 'post',headers)
}

function urlencoded( url, prame ) {
    return Requst( url, prame, 'post', {
        'Content-Type':'application/x-www-form-urlencoded'
    })
}

function deleteRequst(url,data) {
    return Requst( url, data, 'DELETE' )
}

module.exports = {
    get,
    post,
    Requst,
    urlencoded,
    deleteRequst
}