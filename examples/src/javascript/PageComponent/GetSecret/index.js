import dom, {Commponent} from '../../ZDom'

import Input from '../../Component/Input'
import Button from '../../Component/Button'

import Block from '../../Component/Block'

import CopySpan from '../../Component/CopySpan'

import {getSecretByTxId} from '../../Module/exchange'

async function getSecret() {
    const {secret} = this.data
    const secrets = await getSecretByTxId( secret+'',   secret.substr(0,2) === '0x'? 'ETH':'MEER' )
    this.data.secondar = secrets
}

function RedeemETH() {
    const {
        secret
    } = this.data({
        secret: ''
    })
    return (
        Block({},
            dom.h4({}, 'Get Secret'),
            Input({
                label: 'Secret',
                inputClass: 'input-block',
                value: secret,
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            dom.div({ class:"alert alert-secondary"} , 'Secret ' , CopySpan({text:this.data('secondar', '')})),
            Button({
                class:'btn-block btn-secondary', 
                text:`get secret`,
                requst: getSecret.bind(this)
            })
        ) 
    )
}

export default Commponent( RedeemETH )