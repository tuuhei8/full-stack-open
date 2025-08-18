import { useNavigate } from 'react-router-dom'

const RemoveButton = ({ blog, user, remove }) => {
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const removeBlog = () => {
    const confirm = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (confirm) {
      remove(blog)
      navigate('/')
    }
  }

  if (blog.user.username === user.username) {
    return (
      <button onClick={removeBlog}>remove</button>
    )
  } else {
    return
  }
}

export default RemoveButton