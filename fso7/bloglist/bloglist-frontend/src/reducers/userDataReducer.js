import { createSlice } from '@reduxjs/toolkit'
import userInfoService from '../services/users'

const userDataSlice = createSlice({
  name: 'userData',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = userDataSlice.actions

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userInfoService.getAll()
    dispatch(setUsers(users))
  }
}

export default userDataSlice.reducer