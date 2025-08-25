import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } 
    catch {
      console.log('wrong credentials, failed to log in')
    }
  }

  const handleLogOut = async() => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
    } 
    catch {
      console.log('failed logging out')
    }
  }

  const loginForm = () => {
    if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input type="text" value={username} onChange={({ target }) => setUsername(target.value)}/>
            </label>
          </div>
          <div>
            <label>
              password
              <input type="text" value={password} onChange={({target}) => setPassword(target.value)}/>
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
}

  const addBlog = event => {
    event.preventDefault()

    const blogObject = {
      title: newTitle, 
      author: newAuthor,
      url: newUrl,
    }

    blogService.create(blogObject).then(createdBlog => {
      setBlogs(blogs.concat(createdBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    })
  }
  

  return (
    <div> 
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          {user && (
            <div>
              <p>{user.name} logged in</p> <button onClick={() => handleLogOut()}>logout</button>
            </div>
          )}
          <h2>create new</h2>
              <form onSubmit={addBlog}>
                title: <input type="text" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
                <br/>
                author: <input type="text" value={newAuthor} onChange={(event) => setNewAuthor(event.target.value)} />
                <br/>
                url: <input type="text" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} />
                <br/>
                <button type="submit">create</button>
              </form>
              
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />)}
        </div>
      )}
      
    </div>
  )
}

export default App