import dom, {Commponent} from '../../ZDom'


function Col (...child) {
    return (
        dom.div({class: ['col-', this.data.width||'fill', ' col']}, child )
    )
}

export default Commponent(Col)