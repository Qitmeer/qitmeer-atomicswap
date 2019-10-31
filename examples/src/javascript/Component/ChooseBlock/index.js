import dom, {Commponent} from '../../ZDom'

import './index.css'

function ChooseBlock ( ...child ) {
    const name = this.data.id || new Date()*1
    return (
        dom.div({class: 'z_dom_choose_block' },
            dom.label({},
                dom.input({
                    type:'radio', 
                    name, 
                    class:'z_dom_choose_block_radio',
                    '@change': this.data.checked,
                    checked: this.data.active
                }),
                dom.div({class: ['z_dom_choose_block_child border ', this.data.class]}, child)
            )
        )
    )
}

export default Commponent(ChooseBlock)