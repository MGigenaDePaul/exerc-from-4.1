import { useState } from 'react'

const Blog = ({ blog, handleLikeUpdate, handleBlogDelete }) => {
  const [viewBlog, setViewBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle}>
      <div>
        <div style={{ display: 'inline-flex' }}>
          {blog.title} {blog.author}
          <button onClick={() => setViewBlog(v => !v)}>
            {viewBlog ? 'hide' : 'view'}
          </button>
        </div>
      </div>

      {viewBlog && (
        <div>
          <p style={{ margin: '4px 0' }}>{blog.url}</p>
          <p style={{ margin: '4px 0' }}>likes {blog.likes} <button onClick={() => handleLikeUpdate(blog, blog.id)}>like</button></p>
          <p style={{ margin: '4px 0' }}>{blog.user.name}</p>
          <button onClick={() => handleBlogDelete(blog.id)}>remove</button>
        </div>
      )}
    </div>
  )}

export default Blog