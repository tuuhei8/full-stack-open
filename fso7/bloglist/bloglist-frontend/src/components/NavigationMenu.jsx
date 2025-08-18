import { Link } from 'react-router-dom'

const Login = ({ user, logout }) => {
  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return <Link to='/' >login</Link>
  }

  return (
    <em>{user.name} logged in <button onClick={handleLogout}>logout</button></em>
  )
}


const NavigationMenu = ({ user, logout, notification }) => {
  const padding = {
    paddingRight: 5
  }

  const background = {
    backgroundColor: 'grey',
    padding: 5
  }

  return (
    <>
      <div style={background}>
        <Link to='/blogs' style={padding}>blogs</Link>
        <Link to='/users' style={padding}>users</Link>
        <Login user={user} logout={logout} />
      </div>
    </>
  )
}

export default NavigationMenu