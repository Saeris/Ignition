import { render } from "preact"
import "./styles/global.scss"

let elem
let App
const renderApp = () => {
  App = require(`./app/routes`).Root
  elem = render(<App />, document.querySelector(`#app`), elem)
}

renderApp()

if (process.env.NODE_ENV === `production`) {
  if (`serviceWorker` in navigator && location.protocol === `https:`) {
    navigator.serviceWorker.register(`/sw.js`) // eslint-disable-line
  }
} else {
  require(`preact/devtools`)
  if (module.hot) {
    module.hot.accept(`./app/routes`, () => renderApp())
  }
}
