import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('render', () => {
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
})



