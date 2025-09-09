const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const className = message.includes('new') ? 'message success' : 'message error'
  return <div className={className}> {message} </div>
}   

export default Notification