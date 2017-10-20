import { Reducer } from "@services"
import { actions } from "./actions"

@Reducer
class ModalReducer {
  initialState = {
    current: null,
    modals: []
  }

  constructor() {
    this.name = `modal`
  }

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
  }

  addModal(state, payload) {
    const modals = state[this.name].modals
    if (modals.some(modal => modal.id === payload.id)) return modals
    return [...modals, payload]
  }

  removeModal(state, id) {
    state[this.name].modals.filter(modal => modal.id !== id)
  }

  toggleModal = (state, id) => {
    const modals = this.getModals(state)
    const target = modals.find(modal => modal.id === id)
    if (target) target.visible = !target.visible
    return [...modals]
  }

  getCurrent(state) {
    return state[this.name].current
  }

  getModals(state) {
    return state[this.name].modals
  }

  getModalByID(state, id) {
    const modal = state[this.name].modals[id]
    if (modal) return modal
    return null
  }

  getVisibility = (state, id) => {
    const modal = this.getModalByID(state, id)
    if (modal) return modal.visibility
    return false
  }

  getComponent = (state, id) => {
    const modal = this.getModalByID(state, id)
    if (modal) return modal.component
    return null
  }
}

export default new ModalReducer()
