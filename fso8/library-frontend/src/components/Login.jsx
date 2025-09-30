const LogoutButton = ({ logout, token }) => {
  if (token) {
    return <button onClick={logout}>logout</button>
  } else {
    return null
  }
}

export default LogoutButton