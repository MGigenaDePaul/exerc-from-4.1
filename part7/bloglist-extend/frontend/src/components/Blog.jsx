import { Paper, TableContainer } from '@mui/material'
import { useMatch } from 'react-router-dom'

const Blog = ({
  blogs,
  handleLikeUpdate,
  newComment,
  setNewComment,
  handleComment
}) => {
  if (!blogs) return null

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  if (!blog) return null

  return (
    <div>
      <TableContainer className="table-comment-section" component={Paper}>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes} likes{' '}
          <button className="like-button" onClick={() => handleLikeUpdate(blog)}>like</button>
        </p>
        <p>added by {blog.author}</p>
        <h3>comments</h3>
        <form
          className="comment-form"
          onSubmit={(event) => handleComment(blog, event)}
        >
          <input
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </TableContainer>
    </div>
  )
}

export default Blog
