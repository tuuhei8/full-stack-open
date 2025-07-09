import { useState } from 'react'
import RemoveButton from './RemoveButton'
import PropTypes from 'prop-types'



const Blog = ({ blog, addLike, user, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const like = () => {
    blog.likes += 1
    addLike(blog)
  }

  if (blog.user.username === user.username) {
    console.log('OK')
  }

  const test = () => {
    console.log('blog:',blog.user.username)
    console.log('user:', user.username)
  }
  const showButtonValue = visible ? 'hide' : 'show'
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}<input type="submit" value={showButtonValue} onClick={toggleVisibility}></input>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br/>
        likes: {blog.likes} <button onClick={like}>like</button><br/>
        {blog.author}<br/>
        <button onClick={toggleVisibility}>hide</button>
        <button onClick={test}>test</button>
        <RemoveButton blog={blog} user={user} remove={remove} />
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired
}

export default Blog