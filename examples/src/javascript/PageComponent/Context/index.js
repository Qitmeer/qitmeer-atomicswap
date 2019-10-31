import dom, {Commponent} from '../../ZDom'

import './index.css'

import {balancelist} from '../../Module/storage'
import {upDatePrice} from '../../Module/coin'

import Row from '../../Component/Row'
import Col from '../../Component/Col'

import Prompt from '../../Component/Prompt'

import Button from '../../Component/Button'

import ChooseBlock from '../../Component/ChooseBlock'

import CopySpan from '../../Component/CopySpan'


import CreatContract from '../CreatContract'
import RedeemMeer from '../RedeemMeer'
import RedeemETH from '../RedeemETH'
import LockMeer from '../LockMeer'
import GetSecret from '../GetSecret'



import {FefundETH} from '../../Module/exchange'

function shallowCopys() {
    Prompt({status: 'success'}, 'loading')
}

function Context () {

    return [
        Row({},
            Col({width: 3},
                dom.h5({}, 'Account'),
                balancelist.data.balances.mapA( v => (
                    v === ''? '' : 
                    ChooseBlock({
                        id :'choose',
                        // active: true,
                        checked: () => {
                            upDatePrice( v.coin )
                        },
                        // class: 'balance_block'
                    }, 
                        dom.p({class: "article-meta", style: 'margin: 4px 0px; color: #888; font-size: 16px;'}, 
                            v.address 
                        ),
                        dom.h4({}, v.amount,' ', v.coin )
                    )
                )),
                dom.h5({}, 'Tools'),
                RedeemMeer({}),
                RedeemETH({})
            ),
            Col({width: 4},
                dom.h5({}, 'Accept'),
                CreatContract({}),
                dom.h5({}, 'LockTime'),
                LockMeer(),
                GetSecret()
            ),
            Col({width: 5},
                dom.h5({'@click': shallowCopys.bind(this)}, 'Orders'),
                balancelist.data.orders.mapA( v => (
                    v === ''? '' :
                    dom.div({ class: 'z_dom_choose_block border', style: 'margin-top: .4rem;padding: 1rem' },
                        dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Type'),  v.type ),
                        dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'ID'),  CopySpan({text:v.id})),
                        v.secretHash?dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Secret Hash'), CopySpan({text:v.secretHash})):'',
                        v.accept?dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Accept'), v.accept):'',
                        v.num?dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Number'), v.num):'',
                        v.secret? dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Secret'),  CopySpan({text:v.secret})):'',
                        v.script? dom.p({style:"width:100%; overflow:hidden; white-space:nowrap; text-overflow:ellipsis"}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Script'), CopySpan({text:v.script})):'',
                        Button({
                            class:'btn-block btn-secondary', 
                            text:`Fefund`,
                            requst: () => FefundETH(v.accept)
                        })
                    )
                ))
            )
        )
    ]
}

export default Commponent(Context)