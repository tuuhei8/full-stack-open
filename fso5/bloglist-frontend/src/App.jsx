import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import User from './components/User'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [eventMessage, setEventMessage] = useState(null)
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      console.log('newBlog', newBlog)
      setBlogs(blogs.concat(newBlog))
      setEventMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setEventMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      const removedBlog = await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== removedBlog.id))
      setEventMessage(`blog titled ${removedBlog.title} removed`)
      setTimeout(() => {
        setEventMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.change(blogObject.id, blogObject)
      console.log(blogObject)
      console.log('updated:', updatedBlog)

      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (exception) {
      setErrorMessage(`${exception}`)
      console.log(blogObject)

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>login</h2>
        <h2>{errorMessage}</h2>
        <LoginForm handleLogin={handleLogin} uNameValue={username} uNameOnChange={({ target }) => setUsername(target.value)}
          pswValue={password} pswOnChange={({ target }) => setPassword(target.value)}/>
      </div>
    )
  } else {
    const sortedBlogs = blogs.toSorted(function(a, b){return b.likes - a.likes})
    return (
      <div>
        <h2>blogs</h2>
        <h2>{errorMessage}</h2>
        <h2>{eventMessage}</h2>
        <User name={user.name} logout={logout}/>
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Togglable>
        <div>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} addLike={addLike} user={user} remove={removeBlog} />
          )}
        </div>
      </div>
    )
  }
}

export default App