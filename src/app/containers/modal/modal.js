import { connect } from "react-redux"
import ModalReducer from "./reducer"

const selectors = (state, ownProps) => ({
  id: ModalReducer.getCurrent(state),
  visible: id => ModalReducer.getVisibility(state, id),
  component: id => ModalReducer.getComponent(state, id)
})

const actions = dispatch => ({})

@connect(selectors, actions)
export default class Modal extends Component {
  render({ visible, id, component }) {
    if (!visible(id)) return null
    return (
      <aside>
        {component}
      </aside>
    )
  }
}
