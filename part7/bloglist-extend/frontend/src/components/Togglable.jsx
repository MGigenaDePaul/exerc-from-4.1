import { useState, useImperativeHandle } from 'react'
import { Button } from '@mui/material'
const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="inherit" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div className="container-component" style={showWhenVisible}>
        {props.children}
        <Button variant="contained" color="inherit" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
      <br />
    </div>
  )
}

export default Togglable
