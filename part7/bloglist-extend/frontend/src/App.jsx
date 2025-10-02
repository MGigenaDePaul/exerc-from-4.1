import { useState, useEffect, useRef } from 'react'
import { useReducer } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import NotificationContext from './NotificationContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_BLOG':
      return `a new blog "${action.payload.title}" by ${action.payload.author} created`
    case 'CLEAR':
      return ''
    case 'ERROR':
      return 'Wrong credentials'
    default:
      return state
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const queryClient = useQueryClient() 

  const result = useQuery({
    queryKey:['blogs'],
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
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((createdBlog) => {
      setBlogs(blogs.concat(createdBlog))
    })
  }

  const handleLikeUpdate = (blog, id) => {
    const findBlog = blogs.find((blog) => blog.id === id)
    const changedBlog = {
      ...findBlog,
      user: findBlog.user.id,
      likes: findBlog.likes + 1
    }

    blogService
      .update(blog.id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
      })
      .catch(() => {
        console.log('could not update likes')
      })
  }

  const handleBlogDelete = (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    const ok = window.confirm(
      `Do you want to remove blog ${blog.title} by ${blog.author}`
    )
    if (ok) {
      blogService
        .eliminate(id)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== id))
        })
        .catch(() => {
          console.log(`${blog.title} was already deleted from the server`)
          setBlogs(blogs.filter((blog) => blog.id !== id))
        })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
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
      setUser(null)
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
      <NotificationContext.Provider
        value={[notification, notificationDispatch]}
      >
        {!user && loginForm()}
        {user && (
          <div>
            <div>
              {result.isLoading && <div>loading data...</div>}
            </div>
            <h2>blogs</h2>
            <Notification />
            {user && (
              <div>
                <p style={{ display: 'inline-flex' }}>{user.name} logged in</p>
                <button
                  style={{ display: 'inline-flex' }}
                  onClick={() => handleLogOut()}
                >
                  logout
                </button>
              </div>
            )}
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            {blogs && [...blogs]
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
      </NotificationContext.Provider>
    </div>
  )
}

export default App
