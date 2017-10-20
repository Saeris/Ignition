export const actions = {
  MODAL_ADD: `MODAL_ADD`,
  MODAL_REMOVE: `MODAL_REMOVE`,
  MODAL_TOGGLE: `MODAL_TOGGLE`
}

export const addModal = (component, props, visible = false) => ({
  type: actions.MODAL_OPEN,
  payload: { component, props, visible }
})

export const removeModal = id => ({
  type: actions.MODAL_REMOVE,
  payload: { id }
})

export const toggleModal = id => ({
  type: actions.MODAL_TOGGLE,
  payload: { id }
})
