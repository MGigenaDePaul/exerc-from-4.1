const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findByIdAndDelete(request.params.id)
  const user = await User.findById(decodedToken.id)
  logger.info(blog.user.toString())
  logger.info(user._id.toString())

  if ( blog.user.toString() === user._id.toString() ) {
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const savedBlog = await blog.save()
  response.status(200).json(savedBlog)
})

module.exports = blogsRouter
