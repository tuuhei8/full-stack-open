const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
      .populate('user', { username: 1, name: 1, id: 1 })
    response.json(blog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  let blogToUpdate = await Blog.findById(request.params.id)
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', request.body.user.id)
  
  try {
    blogToUpdate.title = body.title
    blogToUpdate.author = body.author
    blogToUpdate.url = body.url
    blogToUpdate.likes = body.likes
    blogToUpdate.user = body.user.id
    await blogToUpdate.save()
    const updatedBlog = await Blog.findById(request.params.id)
      .populate('user', { username: 1, name: 1, id: 1 })
    if (!updatedBlog) {
      return response.status(404).end()
    }
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})



blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  
  try {
    const removedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!removedBlog) {
      return response.status(404).end()
    }
    response.json(removedBlog).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter