import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { Alert } from '@mui/material'
const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  if (!notification) {
    return null
  }

  const className = notification.includes('new') ? 'success' : 'error'
  return <Alert severity={className}>{notification}</Alert>
}

export default Notification
