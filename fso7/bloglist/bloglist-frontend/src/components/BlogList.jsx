import Blog from './Blog'

const BlogList = ({ sortedBlogs }) => {
  return (
    <div data-testid='blogList'>
      <h2>blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default BlogList