// NOTE: This project is using Webpack's providePlugin feature to make frequently used
// libraries such as React available without the need to explicitly import them in every file
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Root } from './app/routes'
import * as Bluebird from 'bluebird'
import 'whatwg-fetch'
import 'font-awesome/css/font-awesome.css'
import './scss/global.scss'

Bluebird.config({ warnings: false })

const render = Component => ReactDOM.render(
  <AppContainer>
    <Component/>
  </AppContainer>,
  document.getElementById(`app`)
)

render(Root)

if (module.hot) module.hot.accept(`./app/routes`, () => render(Root))
