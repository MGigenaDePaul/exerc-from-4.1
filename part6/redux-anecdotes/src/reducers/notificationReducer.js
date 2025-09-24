import {createSlice} from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'initial notification',
    reducers: {
        showNotification(state, action){
          return action.payload
        },
        clearNotification(){
            return ''
        },
    }
})

export const setNotification = (text, seconds) => {
    return dispatch => {
        dispatch(showNotification(text))
        setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}

export const {showNotification, clearNotification} = notificationSlice.actions 
export default notificationSlice.reducer 

