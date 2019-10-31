import dom, {Commponent} from '../../ZDom'

// import './index.css'

function Block ( ...child ) {
    return (
        dom.div({class: ['z_dom_choose_block_child border ', this.data.class], style: 'padding: 1rem' },child)
    )
}

export default Commponent(Block)