const BlogForm = (props) => {
    return (
    	<div>
        <form onSubmit={props.addBlog}>
        <label htmlFor="title">title:</label>
        <input type="text"
          id="title"
          value={props.title}
          onChange={props.titleOnChange}/><br/>
        <label htmlFor="author">author:</label>
        <input type="text"
          id="author"
          value={props.author}
          onChange={props.authorOnChange}/><br/>
        <label htmlFor="url">url:</label>
        <input type="text"
          id="url"
          value={props.url}
          onChange={props.urlOnChange}/><br/><br/>
        <input type="submit" value="Post"></input>
      </form>
    </div>
	)
}

export default BlogForm