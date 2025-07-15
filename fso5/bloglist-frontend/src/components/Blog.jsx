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

  const showButtonValue = visible ? 'hide' : 'show'
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}<button onClick={toggleVisibility}>{showButtonValue}</button>
      </div>
      <div style={showWhenVisible} className='togglableDetails'>
        {blog.url}<br/>
        likes: {blog.likes} <button onClick={like}>like</button><br/>
        {blog.user.name}<br/>
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