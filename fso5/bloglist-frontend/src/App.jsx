import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import User from './components/User'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create({
        title: title,
        author: author,
        url: url
      })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
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
        <p>{errorMessage}</p>
        <h2>login</h2>
          <LoginForm handleLogin={handleLogin} uNameValue={username} uNameOnChange={({ target }) => setUsername(target.value)}
          pswValue={password} pswOnChange={({ target }) => setPassword(target.value)}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <User name={user.name} logout={logout}/>
      <BlogForm addBlog={addBlog} title={title} titleOnChange={({ target }) => setTitle(target.value)}
        author={author} authorOnChange={({ target }) => setAuthor(target.value)}
        url={url} urlOnChange={({ target }) => setUrl(target.value)}/>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App