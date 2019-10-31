import dom, {Commponent} from '../../ZDom'
import './index.css'

function change( el ) {
    this.data.value.Observable.set(el.value)
}

function Input ( ) {
    const id = this.data.id || new Date()*1
    return (
        dom.div({class: ['form-group ', this.data.class ]}, 
            this.data.label?dom.label({for: id}, this.data.label):'',
            dom[ this.data.type == 'textarea'? 'textarea': 'input' ]({
                class: this.data.inputClass || '',
                type: this.data.type || 'text',
                placeholder: this.data.placeholder,
                value: this.data.value,
                '@input': (this.data.value && this.data.value.Observable) ? change.bind(this):this.data['@input'],
                disabled: this.data.disabled || false,
                id
            })
        )
    )
}

export default Commponent(Input)