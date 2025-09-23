import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useReducer } from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote} from './requests'
import NotificationContext from './NotificationContext'

const notificationReducer = (state, action) => {
  switch(action.type) {
    case 'VOTE':
      return `anecdote ${action.payload} voted`
    case 'CREATE':
      return `anecdote ${action.payload} created`
    default: 
      return state
  }
}

const App = () => {  
  const [notification, notificationDispatch] = useReducer(notificationReducer, 'initial notification')

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
      mutationFn: updateAnecdote,
      onSuccess: () => {
        queryClient.invalidateQueries('anecdotes')
      } 
  })
  
  const handleVote = (anecdote) => {
      updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  const result = useQuery({
    queryKey:['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.status === 'error' ){
    return <div>anecdote service not available due to problems in server</div>
  }
  
  const anecdotes = result.data
  console.log(anecdotes)
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm notificationDispatch={notificationDispatch}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => {  
              handleVote(anecdote)
              notificationDispatch({type:'VOTE', payload: anecdote.content})
            }}>
              vote
            </button>
          </div>
        </div>
      )}
    </div>
    </NotificationContext.Provider>
  )
}

export default App
