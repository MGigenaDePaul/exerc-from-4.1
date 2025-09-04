import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders title and author WITHOUT CSS-classes', async() => {
  const blog = {
    title: 'Clean Code: The Good, the Bad and the Ugly',
    author: 'Daniel Gerlach'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Clean Code: The Good, the Bad and the Ugly', { exact: false })
  expect(element).toBeDefined()
})

test('renders title and author WITH CSS-selectors', () => {
  const blog = {
    title: 'Life is good',
    author: 'Cliff Jhonson'
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Life is good')
})

test('does not render this', () => {
  const blog = {
    title: 'Great News',
    author: 'Steve Philips'
  }

  render(<Blog blog={blog} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})

test('when button view is clicked, show blog url and number of likes', async () => {
  const blog = {
    title: 'React testing library is used for Component testing',
    author: 'John Arias',
    url: 'https://testing-library.com/docs/react-testing-library/intro/',
    likes: 5,
    user: { username: 'Jackson', name: 'Michael', id: 'u1' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByRole('button', { name: 'view' })
  await user.click(button)

  const url = screen.getByText(blog.url)
  const likes = screen.getByText('likes 5')

  screen.debug(url)
  screen.debug(likes)

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
})





