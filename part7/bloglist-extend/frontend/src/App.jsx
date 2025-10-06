import { useState, useEffect, useRef, useReducer, useContext } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
// import Blog from './components/Blog'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginContext from './LoginContext'
import NotificationContext from './NotificationContext'
import { Routes, Route, Link, NavLink, useMatch, useNavigate } from 'react-router-dom'

const User = ({ users }) => {
  if (!users) return null

  const match = useMatch('/users/:id')
  const user = match ? users.find((u) => u.id === match.params.id) : null

  if (!user) return null

  return (
    <div>
      <h2>
        {user.name} {user.username}
      </h2>
      <h3>added blogs</h3>
      {user &&
        user.blogs.map((blog) => (
          <ul key={blog.id}>
            <li>{blog.title}</li>
          </ul>
        ))}
    </div>
  )
}


const Users = ({ users }) => {
  return (
    <div>
      <div className="row-header">
        <h2>Users</h2>
        <div className="blogs-created-heading">blogs created</div>
      </div>
      <div>
        {users &&
          [...users].map((u) => (
            <div className="users-info-container" key={u.id}>
              <Link to={`/users/${u.id}`}>
                {u.name} {u.username}
              </Link>
              <div>{u.blogs.length}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

const Blog = ({ blogs, handleLikeUpdate, newComment, setNewComment, handleComment }) => {
  if (!blogs) return null

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  if (!blog) return null

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => handleLikeUpdate(blog)}>like</button></p>
      <p>added by {blog.author}</p>
      <h3>comments</h3>
      <form onSubmit={(event) => handleComment(blog, event)}>
        <input value={newComment} onChange={(event) => setNewComment(event.target.value)}/>
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) =>
          <li key={index}>{comment}</li>)}
      </ul>
    </div>
  )
}

const Blogs = ({ blogs }) => {
  const blogFormRef = useRef()
  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      {blogs &&
          [...blogs]
            .sort((a, b) => a.likes - b.likes)
            .map((blog) => (
              <Link key={blog.id} to={`/blogs/${blog.id}`}>
                <div>
                  {blog.title} {blog.author}
                </div>
              </Link>
            ))}
    </div>
  )
}

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
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <div className="menu-flexbox">
            <Link to="/blogs">blogs</Link>
            <Link to="/users">users</Link>
            <div className="div-log">
              {user && (
                <div className="child-log">
                  <p>{user.name} logged in</p>
                  <button className="logout-button" onClick={() => handleLogOut()}>logout</button>
                </div>
              )}
            </div>
          </div>

          <h2>blogs app</h2>
          <Notification />
          <Routes>
            <Route path="/" element={<Blogs blogs={blogs} />}/>
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/blogs" element={<Blogs blogs={blogs} />} />
            <Route path="/blogs/:id"
              element={<Blog blogs={blogs}
                handleLikeUpdate={handleLikeUpdate}
                newComment={newComment}
                setNewComment={setNewComment}
                handleComment={handleComment}
              />}
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
