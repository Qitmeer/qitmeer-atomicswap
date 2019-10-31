import dom, {Commponent} from '../../ZDom'


function Alert (...child) {
    return (
        dom.div({class: ['col-', this.data.width, ' col']}, child )
    )
}

export default Commponent(Alert)