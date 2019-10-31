import dom, {Commponent} from '../../ZDom'

import Input from '../../Component/Input'
import Button from '../../Component/Button'

import Prompt from '../../Component/Prompt'

import Block from '../../Component/Block'

import {AliceBuyEthByMeer} from '../../Module/exchange'

function redeemMeer() {
    const {
        secret,
        contract,
        num
    } = this.data
    return AliceBuyEthByMeer( num+'', secret+'', contract+'' )
}

function LockMeer() {
    const {
        secret,
        contract,
        num
    } = this.data({
        secret: '',
        contract: '',
        num: 0
    })
    return (
        Block({},
            dom.h4({}, 'Lock Meer'),
            Input({
                label: 'SecretHash',
                inputClass: 'input-block',
                value: secret,
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            Input({
                label: 'Redeem Address',
                inputClass: 'input-block',
                value: contract
                // placeholder,
                // disabled,
                // type: 'password'
            }),
            Input({
                label: 'Number',
                inputClass: 'input-block',
                value: num
            }),
            Button({
                class:'btn-block btn-secondary', 
                text:`Send Meer`,
                requst: redeemMeer.bind(this)
            })
        ) 
    )
}

export default Commponent( LockMeer )