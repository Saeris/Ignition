import { Layout } from '../../containers'
import './home.scss'

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = dispatch => ({

})

@connect(mapStateToProps, mapDispatchToProps)
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
