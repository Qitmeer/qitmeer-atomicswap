import dom, {Commponent} from '../../ZDom'

import Input from '../../Component/Input'
import Button from '../../Component/Button'

import Prompt from '../../Component/Prompt'

import Block from '../../Component/Block'

import {redeemMeerByUser} from '../../Module/exchange'

async function redeemMeer() {
    const {
        secret,
        contract
    } = this.data
    return redeemMeerByUser( secret,  contract )
}

function RedeemMeer() {
    const {
        secret,
        contract
    } = this.data({
        secret: '',
        contract: ''
    })
    return (
        Block({},
            dom.h4({}, 'Redeem Meer'),
            Input({
                label: 'Secret',
                inputClass: 'input-block',
                value: secret,
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            Input({
                label: 'Contract Script',
                inputClass: 'input-block',
                value: contract,
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

export default Commponent( RedeemMeer )