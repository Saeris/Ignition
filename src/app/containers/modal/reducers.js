import { actions } from './actions'

const initialState = {
  modalType: null,
  modalProps: {}
}

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
  case actions.OPEN_MODAL:
    return { modalType: action.modalType, modalProps: action.modalProps }
  case actions.CLOSE_MODAL:
    return initialState
  default:
    return state
  }
}
