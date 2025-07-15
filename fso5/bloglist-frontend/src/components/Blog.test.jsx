import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    user: { username: 'user' },
    title: 'Component testing is done with react-testing-library',
    likes: 3,
    author: 'author',
    url: 'url',
  }

  const user = {
    username: 'user'
  }

  const addLike = () => {}
  const remove = () => {}

  render(<Blog blog={blog} user={user} remove={remove} addLike={addLike} />)

  const element = screen.getByText('Component testing is done with react-testing-library by author')
  expect(element).toBeDefined()
})

test('addLike function is called twice when clicked twice', async () => {
  const blog = {
    user: { username: 'user' },
    title: 'Component testing is done with react-testing-library',
    url: 'url',
    likes: 3,
    author: 'author',
  }

  const user = {
    username: 'user'
  }

  const remove = () => {}
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} remove={remove} addLike={mockHandler} />)

  const userAction = userEvent.setup()
  const button = screen.getByText('like')
  await userAction.click(button)
  await userAction.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

describe('url, likes and name shown after clicking show', () => {
  let container
  const blog = {
    user: { username: 'user', name: 'name here' },
    title: 'Component testing is done with react-testing-library',
    likes: 3,
    author: 'author here',
    url: 'url here',
  }

  const user = {
    username: 'user'
  }

  const remove = () => {}
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} remove={remove} addLike={mockHandler} />).container
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('children are displayed after clicking show', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.togglableDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('url, likes and name are rendered', () => {
    const url = screen.getByText('url here', { exact: false })
    const likes = screen.getByText('likes: 3', { exact: false })
    const name = screen.getByText('name here', { exact: false })

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()
  })
})
