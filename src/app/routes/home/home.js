import { Layout } from "@components/structural"
import "./home.scss"

export default class Home extends Component {
  render() {
    return (
      <Layout id="home">
        <div styleName="header">
          <h1>🚀</h1>
          <h2>Ready for liftoff!</h2>
        </div>
      </Layout>
    )
  }
}
