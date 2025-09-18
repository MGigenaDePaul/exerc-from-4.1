import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    replaceAnecdote(state, action){
      const updated = action.payload
      return state.map(s => s.id !== updated.id ? s : updated)
    },
    appendAnecdote(state, action){
      state.push(action.payload)
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})


export const {appendAnecdote, setAnecdotes, replaceAnecdote} = anecdoteSlice.actions 

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    const returnedAnecdote = await anecdoteService.update(anecdote.id, updatedAnecdote)
    dispatch(replaceAnecdote(returnedAnecdote))
  }
}


export default anecdoteSlice.reducer