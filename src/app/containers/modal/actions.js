export const actions = {
  OPEN_MODAL: `OPEN_MODAL`,
  CLOSE_MODAL: `CLOSE_MODAL`
}

export const openModal = (modalType, modalProps) => ({ type: actions.OPEN_MODAL, modalType, modalProps })

export const closeModal = () => ({ type: actions.CLOSE_MODAL })
