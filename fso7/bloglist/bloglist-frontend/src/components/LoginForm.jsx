const LoginForm = (props) => {
  return  (
    <>
      <h2>log in</h2>
      <form onSubmit={props.handleLogin}>
        <label htmlFor="uName">Username:</label>
        <input type="text"
          data-testid='username'
          id="uName"
          value={props.uNameValue}
          onChange={props.uNameOnChange}/><br/>
        <label htmlFor="psw">Password:</label>
        <input type="text"
          data-testid='password'
          id="psw"
          value={props.pswValue}
          onChange={props.pswOnChange}/><br/><br/>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm