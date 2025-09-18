import {createSlice} from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'initial notification',
    reducers: {
        setNotification(state, action){
          return action.payload
        },
        clearNotification(){
            return ''
        },
    }
})

export const showNotification = (text, seconds) => {
    return dispatch => {
        dispatch(setNotification(text))
        setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}

export const {setNotification, clearNotification} = notificationSlice.actions 
export default notificationSlice.reducer 

