import Notification from "./Notification"

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  message
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={handleUsernameChange}/>
          </label>
        </div>
        <div>
          <label>
            password
            <input type="text" value={password} onChange={handlePasswordChange}/>
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm