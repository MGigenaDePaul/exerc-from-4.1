import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import { useMatch } from 'react-router-dom'

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
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {user &&
              user.blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <ul>
                      <li>{blog.title}</li>
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default User
