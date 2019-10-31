import dom, {Commponent} from '../../ZDom'


function Icon () {
    return (
        dom.i({class:['iconfont ', this.data.i || 'iconfuzhi'], style: 'margin-left: 4px;color: #41403e;'})
    )
}

export default Commponent(Icon)