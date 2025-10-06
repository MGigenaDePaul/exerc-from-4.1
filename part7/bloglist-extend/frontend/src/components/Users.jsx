import { Link } from 'react-router-dom'
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

const Users = ({ users }) => {
  return (
    <div>
      <div className="row-header-users">
        <h2>Users</h2>
        <div className="blogs-created-heading">blogs created</div>
      </div>
      <TableContainer className="table-users" component={Paper}>
        <Table>
          <TableBody>
            {users &&
              [...users].map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Link to={`/users/${u.id}`} className="users">
                      {u.name} {u.username}
                    </Link>
                  </TableCell>
                  <TableCell>{u.blogs.length}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
