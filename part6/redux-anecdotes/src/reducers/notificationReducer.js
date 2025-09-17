import {createSlice} from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'initial notification',
    reducers: {
        sendMessage(state, action){
          return action.payload
        }
    }
})

export const {sendMessage} = notificationSlice.actions 
export default notificationSlice.reducer 

