import { Reducer } from "../../services"
import { actions } from "./actions"

@Reducer
class ModalReducer {
  initialState = {
    current: null,
    modals: []
  };

  reducer = (state = this.initialState, action) => {
    const { type, payload } = action
    switch (type) {
      case actions.MODAL_ADD:
        return this.addModal(state, payload)
      case actions.MODAL_REMOVE:
        return this.removeModal(state, payload.id)
      case actions.MODAL_TOGGLE:
        return this.toggleModal(state, payload.id)
      default:
        return state
    }
  };

  addModal = (state, payload) =>
    state.modals.some(modal => modal.id === payload.id)
      ? state.modals
      : [...state.modals, payload];

  removeModal = (state, id) => state.filter(modal => modal.id !== id);

  toggleModal = (state, id) => {
    const modals = this.getModals(state)
    const target = modals.find(modal => modal.id === id)
    if (!!target) target.visible = !target.visible
    return [...modals]
  };

  getCurrent = state => state.modal.current;

  getModals = state => state.modal.modals;

  getModalByID = (state, id) => {
    const modal = state.modal.modals[id]
    if (!!modal) return modal
    return null
  };

  getVisibility = (state, id) => {
    const modal = this.getModalByID(state, id)
    if (!!modal) return modal.visibility
    return false
  };

  getComponent = (state, id) => {
    const modal = this.getModalByID(state, id)
    if (!!modal) return modal.component
    return null
  };
}

export default new ModalReducer()
