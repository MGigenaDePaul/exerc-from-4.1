import { createSlice, current } from "@reduxjs/toolkit"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action){
      state.push(action.payload)
    }, 
    vote(state, action){
      const id = action.payload
      console.log(current(state))
      return state.map(s => 
        s.id !== id ? s : {...s, votes: s.votes + 1}
      )
    },
    appendAnecdote(state, action){
      state.push(action.payload)
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})


export const {createAnecdote, vote, appendAnecdote, setAnecdotes} = anecdoteSlice.actions 
export default anecdoteSlice.reducer