import dom, {Commponent} from '../../ZDom'

import './index.css'

import Nav from '../../Component/Nav'
import Modals from '../../Component/Modals'
import Input from '../../Component/Input'
import Button from '../../Component/Button'
import Row from '../../Component/Row'
import Col from '../../Component/Col'

import {AliceBuyMeerByEth, AliceBuyEthByMeer} from '../../Module/exchange'

import Prompt from '../../Component/Prompt'

// import {
//     setUser,
//     setAccountLocal,
//     balancelist
// } from '../../Module/coin'

// function setUserPrivate() {
//     Prompt({status: 'success'}, 'loading')
//     // const {value,user}  = this.data
//     // setAccountLocal( user, value )
//     // setUser()
// }

async function buyMeer() {
    const ethNum = this.data.meernum / 100
    await AliceBuyMeerByEth( ethNum )
    Prompt({status: 'success'}, 'success')
}

async function buyEth() {

    AliceBuyEthByMeer(this.data.ethnum)
}

function CreatContract () {
    const coin = 'ETH'
    const numberMeer = this.data('meernum', 0)
    const numberEth = this.data('ethnum', 0)
    
    return (
        dom.div({ class: 'z_dom_choose_block border', style: 'margin-top: .4rem;padding: 1rem' },
            dom.div({class:''},
                dom.h3({class: ''}, `${coin}/MEER`),
                [ 
                    { title: 'Rate', sub: '1/100'},
                    { title: 'SafeTime', sub: '1 hours'},
                    { title: 'Contract', sub: '0x505c53c098A173C9da9aeFee7b7B1a0BF379064e'}
                ].mapA( v => dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, v.title), v.sub)),
                Modals({
                    button: [ `sell ${coin}` ],
                    buttonClass: 'btn-block btn-secondary text-cenert',
                    class: 'adduser',
                    title: 'MEET To ETH',
                    text: [
                        Input({
                            label: `Sell ${coin} number`,
                            type: 'number',
                            '@input': ({value}) => this.data.meernum = value*100
                        }),
                        dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'MEER number'), numberMeer),
                        Button({
                            class:'btn-block btn-secondary', 
                            text:`sell ${coin}`,
                            requst: buyMeer.bind(this)
                        })
                    ]
                }),
                Modals({
                    button: [ `buy ${coin}` ],
                    buttonClass: 'btn-block btn-danger text-cenert',
                    class: 'adduser',
                    title: 'ETH To MEET',
                    text: [
                        Input({
                            label: `Buy ${coin} number`,
                            type: 'number',
                            '@input': ({value}) => this.data.ethnum = value*100
                        }),
                        dom.p({}, dom.span({style: 'color:#888;margin-right: 10px'}, 'Meer number'), numberEth),
                        Button({
                            class:'btn-block btn-secondary', 
                            text:`Buy ${coin}`,
                            requst: buyEth.bind(this)
                        })
                    ]
                })
            )
        )
    )
}

export default Commponent(CreatContract)
// <nav class="border fixed split-nav">
//   <div class="nav-brand">
//     <h3><a href="#">Get PaperCSS</a></h3>
//   </div>
//   <div class="collapsible">
//     <input id="collapsible1" type="checkbox" name="collapsible1">
//     <button>
//     <label for="collapsible1">
//         <div class="bar1"></div>
//         <div class="bar2"></div>
//         <div class="bar3"></div>
//       </label>
//     </button>
//     <div class="collapsible-body">
//       <ul class="inline">
//         <li><a href="#">Documentation</a></li>
//         <li><a href="#">About</a></li>
//         <li><a href="#">Github</a></li>
//       </ul>
//     </div>
//   </div>
// </nav>