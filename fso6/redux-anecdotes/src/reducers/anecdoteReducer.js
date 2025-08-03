import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload.id
      const changedAnecdote = action.payload
      return state.map(a =>
        a.id !== id ? a : changedAnecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = anecdoteToChange => {
  return async dispatch => {
    const changedAnecdote = {
      ...anecdoteToChange, votes: anecdoteToChange.votes + 1
    }
    const newObject = await anecdoteService.update(changedAnecdote.id, changedAnecdote)
    dispatch(voteAnecdote(newObject))
  }
}

export default anecdoteSlice.reducer