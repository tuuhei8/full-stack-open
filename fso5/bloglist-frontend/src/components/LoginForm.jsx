const LoginForm = (props) => {
  return  (
    <>
      <form onSubmit={props.handleLogin}>
        <label htmlFor="uName">Username:</label>
        <input type="text"
          id="uName"
          value={props.uNameValue}
          onChange={props.uNameOnChange}/><br/>
        <label htmlFor="psw">Password:</label>
        <input type="text"
          id="psw"
          value={props.pswValue}
          onChange={props.pswOnChange}/><br/><br/>
        <input type="submit" value="Login"></input>  
      </form>
    </>
  )
}

export default LoginForm