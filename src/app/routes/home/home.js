import { Layout } from '../../containers'
import { connect } from 'react-redux'
import './home.scss'

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = dispatch => ({

})

class Home extends Component {
  render() {
    return (
      <Layout>
        <div className="home">
          <div className="header">
            <h1>🚀</h1>
            <h2>Ready for liftoff!</h2>
          </div>
        </div>
      </Layout>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
