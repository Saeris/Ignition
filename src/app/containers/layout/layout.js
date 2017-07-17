import { PropTypes } from 'prop-types'
import './layout.scss'

export class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    return (
      <main styleName="layout">
        {this.props.children}
      </main>
    )
  }
}
