import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const addBlog = vi.fn()

  const { container } = render(<BlogForm addBlog={addBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('post')

  await user.type(titleInput, 'testing title input...')
  await user.type(authorInput, 'testing author input...')
  await user.type(urlInput, 'testing url input...')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing title input...')
  expect(addBlog.mock.calls[0][0].author).toBe('testing author input...')
  expect(addBlog.mock.calls[0][0].url).toBe('testing url input...')
})