import Notification from './Notification'
import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2 className="login-heading">Log in to application</h2>
      <br />
      <br />
      <Notification />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="username-and-password-div">
          <TextField
            label="username"
            className="username-input"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          ></TextField>
          <br />
          <TextField
            label="password"
            className="password-input"
            type="text"
            value={password}
            onChange={handlePasswordChange}
          ></TextField>
        </div>
        <Button
          className="login-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
