import dom, {Commponent} from '../../ZDom'

import Loading from '../Loading'

function Button ( ) {
    const attr = {class: this.data.class}
    this.data['@click'] ? attr['@click'] = this.data['@click']:''
    let iOk = true
    const text = this.data('text',this.data.text || 'OK')
    this.data.requst ?  attr['@click'] = async () => {
        if ( iOk === false ) return
        iOk = false
        this.data.text = Loading()
        try{
            await this.data.requst()
        }catch(e){}
        iOk = true
        this.data.text = text
    }:'';
    return (
        dom.button( attr, text )
    )
}

export default Commponent(Button)