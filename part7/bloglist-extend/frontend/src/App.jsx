import { useState, useEffect, useRef, useReducer, useContext } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginContext from './LoginContext'
import NotificationContext from './NotificationContext'

const App = () => { 
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [login, loginDispatch] = useContext(LoginContext)
  const [user] = useContext(LoginContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  const blogs = result.data

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      loginDispatch({type: 'LOGIN', payload: user})
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

  const deletedBlogMutation = useMutation({
    mutationFn: blogService.eliminate,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const handleBlogDelete = (blog) => {
    console.log('blog object', blog)
    const ok = window.confirm(`Do you want to remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      deletedBlogMutation.mutate(blog)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      console.log('usuario', user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      loginDispatch({type: 'LOGIN', payload: user})
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
      loginDispatch({type:'LOGOUT'})
      setUsername('')
      setPassword('')
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
    <div>
          {!user && loginForm()}
          {user && (
            <div>
              <h2>blogs</h2>
              <Notification />
              {user && (
                <div>
                  <p style={{ display: 'inline-flex' }}>{user.name} logged in</p>
                  <button style={{ display: 'inline-flex' }} onClick={() => handleLogOut()}>
                    logout
                  </button>
                </div>
              )}
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm />
              </Togglable>
              {blogs &&
                [...blogs]
                  .sort((a, b) => a.likes - b.likes)
                  .map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      handleLikeUpdate={handleLikeUpdate}
                      handleBlogDelete={handleBlogDelete}
                      currentUser={user}
                    />
                  ))}
            </div>
          )}
    </div>
  )
}

export default App
