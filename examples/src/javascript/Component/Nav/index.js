import dom, {Commponent} from '../../ZDom'


function Nav () {
    return (
        dom.nav({class: ' split-nav'},
            dom.div({class: 'nav-brand'},
                dom.h2({}, this.data.title )    
            ),
            dom.div({class:'collapsible-body'},
                dom.ul({class:'inline'}, this.data.body?this.data.body.mapA( v => dom.li({}, v)):'')
            )
        )
    )
}

export default Commponent(Nav)
// <nav class="border fixed split-nav">
//   <div class="nav-brand">
//     <h3><a href="#">Get PaperCSS</a></h3>
//   </div>
//   <div class="collapsible">
//     <input id="collapsible1" type="checkbox" name="collapsible1">
//     <button>
//     <label for="collapsible1">
//         <div class="bar1"></div>
//         <div class="bar2"></div>
//         <div class="bar3"></div>
//       </label>
//     </button>
//     <div class="collapsible-body">
//       <ul class="inline">
//         <li><a href="#">Documentation</a></li>
//         <li><a href="#">About</a></li>
//         <li><a href="#">Github</a></li>
//       </ul>
//     </div>
//   </div>
// </nav>