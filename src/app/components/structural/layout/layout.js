import { Modal } from "@components/containers"
import "./layout.scss"

export default class Layout extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  render({ id, children }) {
    return (
      <div styleName={`layout`}>
        <Modal />
        <main id={id}>{children}</main>
      </div>
    )
  }
}
