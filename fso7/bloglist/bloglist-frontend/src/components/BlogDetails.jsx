import { useState } from 'react'
import { useParams } from 'react-router-dom'
import RemoveButton from './RemoveButton'

const Comments = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <ul>
      {comments.map(c =>
        <li key={c._id}>{c.content}</li>
      )}
    </ul>
  )
}

const BlogDetails = ({ sortedBlogs, addLike, user, removeBlogHandler, commentHandler }) => {
  const id = useParams().id
  const blog = sortedBlogs.find(b => b.id === id)
  const [comment, setComment] = useState('')

  if (!blog) {
    return null
  }

  const like = () => {
    addLike(blog)
  }

  const createComment = (event) => {
    event.preventDefault()
    commentHandler(
      blog,
      {
        content: comment
      }
    )
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href='#'>{blog.url}</a><br/>
      likes: {blog.likes} <button onClick={like}>like</button><br/>
      added by {blog.user.name}<br/>
      <RemoveButton blog={blog} user={user} remove={removeBlogHandler} /><br/><br/>
      <form onSubmit={createComment}>
        <input type='text' placeholder='write comment'
          id='commentField'
          value={comment}
          onChange={({ target }) => setComment(target.value)} />
        <button type="submit">add comment</button>
      </form>
      <Comments comments={blog.comments} />
    </div>
  )
}

export default BlogDetails