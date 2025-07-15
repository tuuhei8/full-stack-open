import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={createBlog}>
        <label htmlFor="title">title:</label>
        <input type="text"
          data-testid='title'
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}/><br/><br/>
        <label htmlFor="author">author:</label>
        <input type="text"
          data-testid='author'
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}/><br/><br/>
        <label htmlFor="url">url:</label>
        <input type="text"
          data-testid='url'
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}/><br/><br/>
        <button type="submit">post</button>
      </form>
    </div>
  )
}

export default BlogForm