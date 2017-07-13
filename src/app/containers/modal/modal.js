import { connect } from 'react-redux'
import { modalReducer } from './reducers'
import { store } from '../../services'
import TabListModal from '../tabListModal/tabListModal'

store.addReducer(`modal`, modalReducer)

const mapStateToProps = (state, ownProps) => ({
  modalType: state.modal.modalType,
  modalProps: state.modal.modalProps
})

const mapDispatchToProps = dispatch => ({

})

class Modal extends Component {
  static defaultProps = {
    modals: {
      TabListModal
    }
  }

  render() {
    if (!this.props.modalType) return null
    const SpecificModal = this.props.modals[this.props.modalType]
    return (<SpecificModal {...this.props.modalProps} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
