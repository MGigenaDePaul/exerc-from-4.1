import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector (state => state.filter)
  
    const filterAnecdotes = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    const dispatch = useDispatch()

    return (
      <div>
          {[...filterAnecdotes].sort((a,b) => a.votes - b.votes).map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
            </div>
          </div>
        )}
      </div>
    )
}

export default AnecdoteList
