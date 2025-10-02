import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  
  if (!notification) {
    return null
  }

  const className = notification.includes('new') ? 'message success' : 'message error'
  return <div className={className}> {notification} </div>
}   

export default Notification