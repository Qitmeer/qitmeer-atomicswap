import dom, {Commponent} from '../../ZDom'

import Input from '../../Component/Input'
import Button from '../../Component/Button'

import Prompt from '../../Component/Prompt'

import Block from '../../Component/Block'

import {redeemEthByUser} from '../../Module/exchange'

function redeemMeer() {
    const {
        secret,
        contract
    } = this.data
    return redeemEthByUser( secret, contract )
}

function RedeemETH() {
    const {
        secret,
        contract
    } = this.data({
        secret: '',
        contract: ''
    })
    return (
        Block({},
            dom.h4({}, 'Redeem Eth'),
            Input({
                label: 'Secret',
                inputClass: 'input-block',
                value: secret,
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            Input({
                label: 'Accepter',
                inputClass: 'input-block',
                value: contract
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            Button({
                class:'btn-block btn-secondary', 
                text:`Redeem`,
                requst: redeemMeer.bind(this)
            })
        ) 
    )
}

export default Commponent( RedeemETH )