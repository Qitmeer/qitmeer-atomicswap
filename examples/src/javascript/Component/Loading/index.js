import dom,{ Commponent } from '../../ZDom'

import './index.css'

function Loading( ) {
    return ( 
        dom.div({class:'zy_loader_icon'},
            dom.img({src:['./static/img/loading/',(this.data.svg || 'oval-w'),'.svg']})
        )
    )
}

export default Commponent(Loading) 