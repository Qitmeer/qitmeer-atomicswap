import dom from '../../ZDom'


import NavBar from '../../PageComponent/NavBar'

import Context from '../../PageComponent/Context'

function Index() {
   return (
        dom.div({class:'index'},
            NavBar({}),
            Context({})
        )
   )
}

export default Index