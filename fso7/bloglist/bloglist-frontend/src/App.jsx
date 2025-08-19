import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogReducer, { initializeBlogs, createBlog, addVote, removeBlog, addComment } from './reducers/blogReducer'
import notificationReducer, { setNotification } from './reducers/notificationReducer'
import userReducer, { setUser } from './reducers/userReducer'
import userDataReducer, { initializeUsers } from './reducers/userDataReducer'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'
import NavigationMenu from './components/NavigationMenu'
import BlogList from './components/BlogList'
import NoPage from './components/NoPage'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)
  const userData = useSelector(state => state.userInfo)
  const blogFormRef = useRef()
  const sortedBlogs = blogs.toSorted(function(a, b){return b.likes - a.likes})

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 5))
    } catch (exception) {
      dispatch(setNotification(`${exception}`, 5))
    }
  }

  const commentHandler = async (blogToUpdate, commentObject) => {
    try {
      dispatch(addComment(blogToUpdate, commentObject))
    } catch (exception) {
      dispatch(setNotification(`${exception}`, 5))
    }
  }

  const removeBlogHandler = async (blogObject) => {
    try {
      dispatch(removeBlog(blogObject))
      dispatch(setNotification(`blog titled ${blogObject.title} removed`, 5))
    } catch (exception) {
      dispatch(setNotification(`${exception}`, 5))
    }
  }

  const addLike = async (blogObject) => {
    try {
      dispatch(addVote(blogObject))
    } catch (exception) {
      dispatch(setNotification(`${exception}`, 5))
    }
  }

  const logout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
    blogService.setToken(null)
  }

  if (user === null) {
    return (
      <Router>
        <div>
          <NavigationMenu user={user} logout={logout} />
          <h2>Blog app</h2>
          <h2>{notification}</h2>
          <Routes>
            <Route path='/' element={<LoginForm handleLogin={handleLogin} uNameValue={username} uNameOnChange={({ target }) => setUsername(target.value)}
              pswValue={password} pswOnChange={({ target }) => setPassword(target.value)} />} />
            <Route path='/users' element={<Users data={userData} />} />
            <Route path='/blogs' element={<BlogList sortedBlogs={sortedBlogs} />}/>
            <Route path='/users/:id' element={<UserDetails userData={userData} />} />
            <Route path='/blogs/:id' element={<BlogDetails sortedBlogs={sortedBlogs} addLike={addLike} user={user}
              removeBlogHandler={removeBlogHandler} commentHandler={commentHandler} />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
      </Router>
    )
  } else {

    return (
      <Router>
        <div>
          <NavigationMenu user={user} logout={logout} />
          <h2>blog app</h2>
          <h2>{notification}</h2>
          <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          <Routes>
            <Route path='/' element={<BlogList sortedBlogs={sortedBlogs} />} />
            <Route path='/users' element={<Users data={userData} />} />
            <Route path='/blogs' element={<BlogList sortedBlogs={sortedBlogs} />}/>
            <Route path='/users/:id' element={<UserDetails userData={userData} />} />
            <Route path='/blogs/:id' element={<BlogDetails sortedBlogs={sortedBlogs} addLike={addLike} user={user}
              removeBlogHandler={removeBlogHandler} commentHandler={commentHandler} />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
      </Router>
    )
  }
}

export default App