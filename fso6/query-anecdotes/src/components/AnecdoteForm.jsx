import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../utils/contextUtilities'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      dispatchNotification({
      type: 'NOTIFICATION',
      payload: `${error.response.data.error}`
    })
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
      
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: content, votes: 0 })
    dispatchNotification({
      type: 'NOTIFICATION',
      payload: `you added anecdote ${content}`
    })
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
