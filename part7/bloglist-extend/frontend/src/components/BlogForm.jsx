import { useContext, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'

const BlogForm = ({ createBlog }) => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
/*
  const queryClient = useQueryClient() 

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })
*/
  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    notificationDispatch({
      type: 'CREATE_BLOG',
      payload: { title: newTitle, author: newAuthor }
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
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
