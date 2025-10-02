import { useContext, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'

const BlogForm = ({ createBlog }) => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const queryClient = useQueryClient() 

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      // invalidateQueries --> Refetch blogs so the newly created blog comes back with the populated user info
      queryClient.invalidateQueries({queryKey:['blogs']})
    }
  })

  const addBlog = async (event) => {
    event.preventDefault()    
    newBlogMutation.mutate({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })

    notificationDispatch({ type: 'CREATE_BLOG', payload: { title: newTitle, author: newAuthor } })
    setTimeout(() => { notificationDispatch({ type: 'CLEAR' }) }, 5000)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:{' '}
        <input
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="write title"
        />
        <br />
        author:{' '}
        <input
          type="text"
          value={newAuthor}
          onChange={(event) => setNewAuthor(event.target.value)}
          placeholder="write author"
        />
        <br />
        url:{' '}
        <input
          type="text"
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          placeholder="write url"
        />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
