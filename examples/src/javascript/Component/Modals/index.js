import dom, {Commponent} from '../../ZDom'

function Modals (...child) {
    const modal = this.data.id || new Date()*1 + Math.random()*10000 + ''
    const checked = {class:'modal-state', id: modal, type: 'checkbox'}
    checked.checked = this.data.open
    if ( this.data.open && this.data.open.Observable ) {
        checked['@change'] = el => {
            this.data.open.Observable.set(el.checked)
        }
    }
    
    return (
        dom.div({ class: ['z_modal ', this.data.class]},
            dom.div({class: 'row flex-spaces child-borders'}, 
                dom.label({class:['paper-btn ', this.data.buttonClass],for: modal}, this.data.button )
            ),
            dom.input(checked),
            dom.div({class: 'modal', style: 'margin:0;z-index: 100;'},
                dom.label({class:'modal-bg',for: modal}),
                dom.div({class:'modal-body',style:'min-width: 400px;'},
                    dom.label({class:'btn-close',for: modal}, 'X'),
                    this.data.title?dom.h4({class:'modal-title'}, this.data.title):'',
                    this.data.subtitle?dom.h5({class:'modal-subtitle'}, this.data.subtitle):'',
                    this.data.text?dom.div({class:'modal-text'}, this.data.text):'',
                    child
                )
            )
        )
    )
}

export default Commponent(Modals)
