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
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}/><br/>
        <label htmlFor="author">author:</label>
        <input type="text"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}/><br/>
        <label htmlFor="url">url:</label>
        <input type="text"
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}/><br/><br/>
        <input type="submit" value="Post"></input><br/>
      </form>
    </div>
  )
}

export default BlogForm