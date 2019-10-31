import dom, {Commponent} from '../../ZDom'

import './index.css'

function Prompt (...child) {
    this.data('show', '')
    const time = this.data.time || .8
    const Dome = (
        dom.div({class: [ 'z_prompt ', this.data.class,' ', this.data.show ]}, 
            dom.div({class: ['alert alert-',this.data.status || 'primary',' z_prompt_info shadow']}, child)
        )
    )
    Dome.style.transition = `opacity ${time}s;`
    window.document.body.append(Dome)
    setTimeout(() => {
        this.data.show = 'show'
        setTimeout(()=>{ 
            this.data.show = ''
            setTimeout(()=> {
                Dome.remove()
            }, time*1000)
        },(this.data.showTime || 1.2)*1000) 
    }, 0);
    return Dome
}

export default Commponent(Prompt)

// <div class="alert alert-primary">Alert-primary</div>
//   <div class="alert alert-secondary">Alert-secondary</div>
//   <div class="alert alert-success">Alert-success</div>
//   <div class="alert alert-warning">Alert-warning</div>
//   <div class="alert alert-danger"