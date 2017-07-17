// NOTE: This project is using Webpack's providePlugin feature to make frequently used
// libraries such as React available without the need to explicitly import them in every file
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Root } from './app/routes'
import './scss/global.scss'

const render = Component => ReactDOM.render(
  <AppContainer>
    <Component/>
  </AppContainer>,
  document.querySelector(`#app`)
)

render(Root)

if (module.hot) module.hot.accept(`./app/routes`, () => { render(Root) })
