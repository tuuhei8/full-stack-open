const RemoveButton = ({ blog, user, remove }) => {

  const removeBlog = () => {
    const confirm = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (confirm) {
      remove(blog)
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