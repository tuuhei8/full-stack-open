import { configureStore } from '@reduxjs/toolkit'
import blogReducer from '../reducers/blogReducer'
import notificationReducer from '../reducers/notificationReducer'
import userReducer from '../reducers/userReducer'
import userDataReducer from '../reducers/userDataReducer'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
    userInfo: userDataReducer
  }
})

export default store