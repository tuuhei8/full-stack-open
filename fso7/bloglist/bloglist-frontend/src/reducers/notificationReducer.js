import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    notification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { notification, clearNotification } = notificationSlice.actions

export const setNotification = (content, timeout) => {
  return async dispatch => {
    dispatch(notification(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer