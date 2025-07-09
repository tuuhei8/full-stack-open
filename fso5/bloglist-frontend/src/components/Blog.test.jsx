import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    user: {username: 'user'},
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'url',
  }

  const user = {
    username: 'user'
  }

  const addLike = () => {}
  const remove = () => {}

  render(<Blog blog={blog} user={user} remove={remove} addLike={addLike} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})