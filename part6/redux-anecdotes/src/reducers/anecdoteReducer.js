import { createSlice, current } from "@reduxjs/toolkit"

const getId = () => Number((100000 * Math.random()).toFixed(0))

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action){
      const content = action.payload
      state.push({
        content,
        votes: 0,
        id: getId()
      })
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
    }
  }
})


export const {createAnecdote, vote, appendAnecdote} = anecdoteSlice.actions 
export default anecdoteSlice.reducer