import { Modal } from ".."
import "./layout.scss"

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render({ children }) {
    return (
      <main styleName="layout">
        <Modal />
        {children}
      </main>
    )
  }
}
