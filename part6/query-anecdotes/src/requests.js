import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (newAnecdote) => {
  if (newAnecdote.content.length < 5) {
    throw new Error('too short anecdote, must have length 5 or more')
  }
  return axios.post(baseUrl, newAnecdote).then(res => res.data)
}

export const updateAnecdote = updatedAnecdote =>
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)