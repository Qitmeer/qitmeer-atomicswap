import dom, {Commponent} from '../../ZDom'

import './index.css'

import Nav from '../../Component/Nav'
import Modals from '../../Component/Modals'
import Input from '../../Component/Input'
import Button from '../../Component/Button'

// import Prompt from '../../Component/Prompt'

import {getAccountLocal} from '../../Module/coin'

import {
    setUser,
    setAccountLocal,
    balancelist
} from '../../Module/coin'

function setUserPrivate() {
    // Prompt({status: 'success'}, 'loading')
    const {value,user}  = this.data
    setAccountLocal( user, value )
    setUser()
}

function NavBar () {

    const {user,open,value} = this.data({
        user: '',
        value:'',
        open: false
    })
    
    const users = getAccountLocal() || {}
    return (
        Nav({
            title: 'Qitmeer-cross-dome',
            body: [
                Modals({
                    button: [ users.name || '添加账户' ],
                    class: 'adduser',
                    title: '设置账户',
                    open,
                    text: [
                        Input({
                            label: '名称',
                            value: user,
                            // placeholder,
                            // disabled,
                            // type: 'password'
                        }),
                        Input({
                            label: '秘钥',
                            value: value,
                            type: 'password'
                        }),
                        Button({
                            class: 'btn-block',
                            '@click': setUserPrivate.bind(this)
                        })
                    ]
                })
            ]
        })
    )
}

export default Commponent(NavBar)
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