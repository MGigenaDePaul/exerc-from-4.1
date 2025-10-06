import { useState, useEffect, useContext } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import User from './components/User'
import Users from './components/Users'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import LoginContext from './LoginContext'
import NotificationContext from './NotificationContext'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Container, AppBar, Button, Toolbar, Alert } from '@mui/material'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [login, loginDispatch] = useContext(LoginContext)
  const [user] = useContext(LoginContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newComment, setNewComment] = useState('')

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  //  fetch users
  const resultUsers = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const users = resultUsers.data

  console.log('watch users', users)

  // fetch Blogs
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const blogs = result.data

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      loginDispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const updatedBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const handleLikeUpdate = (blog) => {
    updatedBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const newCommentMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleComment = (blog, event) => {
    event.preventDefault()
    newCommentMutation.mutate({ ...blog, comment: newComment })
    setNewComment('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      loginDispatch({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')
    } catch {
      notificationDispatch({ type: 'ERROR' })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  const handleLogOut = async () => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      loginDispatch({ type: 'LOGOUT' })
      setUsername('')
      setPassword('')

      navigate('/')
    } catch {
      console.log('failed logging out')
    }
  }

  const loginForm = () => {
    if (user === null) {
      return (
        <div>
          <Togglable buttonLabel="login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
      )
    }
  }

  return (
    <Container>
      {!user && loginForm()}
      {user && (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit">
                <Link className="menu-link" to="/blogs">
                  blogs
                </Link>
              </Button>
              <Button color="inherit">
                <Link className="menu-link" to="/users">
                  users
                </Link>
              </Button>
              <div className="div-log">
                {user && (
                  <div className="child-log">
                    <Alert
                      className="logged-in-notification"
                      severity="success"
                    >
                      {user.name} logged in
                    </Alert>
                    <button
                      className="logout-button"
                      onClick={() => handleLogOut()}
                    >
                      logout
                    </button>
                  </div>
                )}
              </div>
            </Toolbar>
          </AppBar>

          <h2>blogs app</h2>
          <Notification />
          <Routes>
            <Route path="/" element={<Blogs blogs={blogs} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/blogs" element={<Blogs blogs={blogs} />} />
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blogs={blogs}
                  handleLikeUpdate={handleLikeUpdate}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleComment={handleComment}
                />
              }
            />
          </Routes>
        </div>
      )}
    </Container>
  )
}

export default App
