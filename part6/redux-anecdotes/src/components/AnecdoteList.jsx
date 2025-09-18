import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
  
    const filterAnecdotes = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    const dispatch = useDispatch()

    const handleVote = (anecdote) => {
      dispatch(vote(anecdote.id))
      dispatch(showNotification(`you voted ${anecdote.content}`, 5))
    }

    return (
      <div>
          {[...filterAnecdotes].sort((a,b) => a.votes - b.votes).map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
    )
}

export default AnecdoteList
