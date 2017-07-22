import { Layout } from "../../containers"
import "./home.scss"

const selectors = (state, ownProps) => ({})

const actions = dispatch => ({})

@connect(selectors, actions)
export default class Home extends Component {
  render() {
    return (
      <Layout>
        <div styleName="home">
          <div styleName="header">
            <h1>🚀</h1>
            <h2>Ready for liftoff!</h2>
          </div>
        </div>
      </Layout>
    )
  }
}
