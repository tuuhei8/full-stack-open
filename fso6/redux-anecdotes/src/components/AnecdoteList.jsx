import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
   
  const unsortedAnecdotes = useSelector(state => state.filter === null
    ? state.anecdotes
    : state.anecdotes.filter(a => a.content.toLocaleLowerCase().includes(state.filter.toLocaleLowerCase()))
  )
  
  const anecdotes = unsortedAnecdotes.toSorted(function(a, b){return b.votes - a.votes})
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList