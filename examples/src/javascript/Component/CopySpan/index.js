import dom, {Commponent} from '../../ZDom'

import copyCli from 'copy-to-clipboard'

import Prompt from '../Prompt'
import Icon from '../Icon'

function CopyText() {
    copyCli(
        this.data.copy || 
        (this.data.text && this.data.text.Observable )?this.data.text.Observable.get():
        this.data.text
    );
    Prompt({status: 'success'}, '复制成功！')
    this.data.copyed?this.data.copyed():''
}

function CopySpan( ) {
    return dom.span( { style: 'cursor: pointer;', class: 'z_dom_copy', '@click': CopyText.bind(this)}, this.data.text, this.data.i?Icon({i:'iconfuzhi'}):'' )
}

export default Commponent(CopySpan)