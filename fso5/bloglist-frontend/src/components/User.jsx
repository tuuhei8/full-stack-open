const User = (props) => {
  return (
    <p>
      {props.name} logged in <button onClick={props.logout}>logout</button>
    </p>
  )
}

export default User