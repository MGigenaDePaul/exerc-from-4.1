import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
const Blogs = ({ blogs }) => {
  const blogFormRef = useRef()
  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs &&
              [...blogs]
                .sort((a, b) => a.likes - b.likes)
                .map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <Link to={`/blogs/${blog.id}`}>
                        <div>
                          {blog.title} {blog.author}
                        </div>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Blogs
