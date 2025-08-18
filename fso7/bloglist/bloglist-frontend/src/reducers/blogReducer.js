import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import userDataReducer, { initializeUsers } from './userDataReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    voteBlog(state, action) {
      const id = action.payload.id
      const changedBlog = action.payload
      return state.map(b =>
        b.id !== id ? b : changedBlog
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      const id = action.payload.id
      return state.filter(b =>
        b.id !== id
      )
    },
    updateComments(state, action) {
      const id = action.payload.id
      const changedBlog = action.payload
      return state.map(b =>
        b.id !== id ? b : changedBlog
      )
    }
  }
})

export const { voteBlog, appendBlog, setBlogs, deleteBlog, updateComments } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
    dispatch(initializeUsers())
  }
}

export const removeBlog = blogToRemove => {
  return async dispatch => {
    const deletedBlog = await blogService.remove(blogToRemove.id)
    dispatch(deleteBlog(deletedBlog))
    dispatch(initializeUsers())
  }
}

export const addVote = blogToChange => {
  return async dispatch => {
    const changedBlog = {
      ...blogToChange, likes: blogToChange.likes + 1
    }
    const newObject = await blogService.change(changedBlog.id, changedBlog)
    dispatch(voteBlog(newObject))
  }
}

export const addComment = (blogToUpdate, commentObject) => {
  return async dispatch => {
    const newObject = await blogService.postComment(blogToUpdate.id, commentObject)
    const updatedComments = newObject.comments
    const updatedBlog = {
      ...blogToUpdate, comments: updatedComments
    }
    dispatch(updateComments(updatedBlog))
  }
}

export default blogSlice.reducer