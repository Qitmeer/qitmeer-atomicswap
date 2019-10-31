import dom, {Commponent} from '../../ZDom'


function Row (...child) {
    return (
        dom.div({class: ['row ', this.data.class]}, child )
    )
}

export default Commponent(Row)