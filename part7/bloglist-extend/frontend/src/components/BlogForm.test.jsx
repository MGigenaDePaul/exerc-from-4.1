import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('when form calls the event handler', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)
  const inputTitle = screen.getByPlaceholderText('write title')
  const inputAuthor = screen.getByPlaceholderText('write author')
  const inputUrl = screen.getByPlaceholderText('write url')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'writing a title')
  await user.type(inputAuthor, 'writing an author')
  await user.type(inputUrl, 'writing a url')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
})